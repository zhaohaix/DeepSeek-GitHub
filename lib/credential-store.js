import {spawn} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
import {mkdir,readFile,rename,stat,unlink,writeFile} from 'node:fs/promises';
import path from 'node:path';

export function command(executable, args, {input = '', timeout = 30000} = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {windowsHide: true, stdio: ['pipe', 'pipe', 'ignore']});
    let stdout = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => { stdout += chunk; });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeout);
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => {
      clearTimeout(timer);
      if (timedOut) reject(Error('凭据操作超时。'));
      else resolve({code, stdout});
    });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

export async function windowsSeal(action, value) {
  if (process.platform !== 'win32') throw Error('DPAPI 仅在 Windows 上可用。');
  const operation = action === 'protect' ? 'Protect' : 'Unprotect';
  const script = `$ErrorActionPreference='Stop'; Add-Type -AssemblyName System.Security; $b=[Convert]::FromBase64String([Console]::In.ReadToEnd().Trim()); $r=[Security.Cryptography.ProtectedData]::${operation}($b,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser); [Console]::Write([Convert]::ToBase64String($r))`;
  const result = await command('powershell.exe', ['-NoProfile','-NonInteractive','-Command',script], {
    input: action === 'protect' ? Buffer.from(value, 'utf8').toString('base64') : value
  });
  if (result.code !== 0) throw Error('Windows 凭据保护操作失败。');
  return action === 'protect' ? result.stdout.trim() : Buffer.from(result.stdout.trim(), 'base64').toString('utf8');
}

export function fileCredentialStore(root, seal = windowsSeal) {
  const filename = path.join(root, 'credential.dpapi');
  return {
    async exists() {
      try { return (await stat(filename)).isFile(); }
      catch (error) { if (error.code === 'ENOENT') return false; throw error; }
    },
    async read() {
      let encrypted;
      try { encrypted = await readFile(filename, 'utf8'); }
      catch (error) { if (error.code === 'ENOENT') return null; throw error; }
      try { return await seal('unprotect', encrypted); }
      catch {
        throw Object.assign(Error('本机 GitHub 凭据无法解密，请重新连接。'), {
          status: 401, reason: 'decrypt_failed', hasCredential: true
        });
      }
    },
    async write(plain, beforeCommit = () => {}) {
      const encrypted = await seal('protect', plain);
      await mkdir(root, {recursive: true});
      const temp = path.join(root, 'credential-' + randomUUID() + '.tmp');
      try {
        await writeFile(temp, encrypted, {mode: 0o600, flag: 'wx'});
        beforeCommit();
        await rename(temp, filename);
      } finally { await unlink(temp).catch(() => {}); }
    },
    async remove() {
      try { await unlink(filename); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
  };
}

// The security tool returns the low byte of errSecItemNotFound (-25300).
const itemNotFound = 44;
const keychainError = () => Object.assign(
  Error('无法访问 macOS 钥匙串。请确认登录钥匙串已解锁，并允许访问 DeepSeek GitHub Studio 的凭据。'),
  {status: 503, reason: 'keychain_unavailable'}
);

export function macCredentialStore(root, {run = command, keychain} = {}) {
  const service = 'DeepSeek GitHub Studio';
  // Different DSH_HOME directories must not share a Keychain item.
  const account = createHash('sha256').update(path.resolve(root)).digest('hex');
  const identity = ['-s', service, '-a', account];
  const keychains = keychain ? [keychain] : [];
  async function security(args, options) {
    try { return await run('/usr/bin/security', args, options); }
    catch { throw keychainError(); }
  }
  async function find(passwordOnly) {
    const flags = passwordOnly ? ['-w'] : [];
    const result = await security(['find-generic-password', ...flags, ...identity, ...keychains]);
    if (result.code === itemNotFound) return null;
    if (result.code !== 0) throw keychainError();
    return result.stdout;
  }
  return {
    async exists() { return (await find(false)) !== null; },
    async read() {
      const result = await find(true);
      if (result === null) return null;
      const encoded = result.trim();
      if (!/^v1\.[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
        throw Object.assign(Error('钥匙串中的 GitHub 凭据格式无效，请重新登录。'), {
          status: 401, reason: 'invalid_local', hasCredential: true
        });
      }
      return Buffer.from(encoded.slice(3), 'base64').toString('utf8');
    },
    async write(plain, beforeCommit = () => {}) {
      // Pass the credential through a pipe, never through the process arguments.
      const encoded = 'v1.' + Buffer.from(plain, 'utf8').toString('base64');
      const args = [...identity, '-U', '-w', encoded, ...keychains];
      if (args.some(arg => /[\r\n\0]/.test(arg))) throw keychainError();
      const quoted = args.map(arg => '"' + arg.replace(/["\\]/g, '\\$&') + '"');
      const input = 'add-generic-password ' + quoted.join(' ') + '\n';
      if (Buffer.byteLength(input) >= 4095) throw Error('GitHub 凭据过长，无法保存到 macOS 钥匙串。');
      beforeCommit();
      const result = await security(['-q', '-i'], {input});
      if (result.code !== 0) throw keychainError();
    },
    async remove() {
      const result = await security(['delete-generic-password', ...identity, ...keychains]);
      if (result.code !== 0 && result.code !== itemNotFound) throw keychainError();
    }
  };
}

// The Android guest runs Linux and exposes Harness's managed credential provider.
// Keep its record separate from model credentials and desktop credential stores.
const harnessCredentialKey = 'github-connect/github-oauth';

export function harnessCredentialStore(getProvider) {
  function provider() {
    const service = getProvider();
    if (!service || ['describeRecord', 'readRecord', 'modifyRecord', 'deleteRecord'].some(
      method => typeof service[method] !== 'function'
    )) {
      throw Object.assign(Error('Harness 凭据服务不可用，请检查当前主机或重启引擎。'), {status: 503});
    }
    return service;
  }
  return {
    async exists() {
      return (await provider().describeRecord(harnessCredentialKey)).configured === true;
    },
    async read() {
      const record = await provider().readRecord(harnessCredentialKey);
      if (record === undefined) return null;
      if (record.kind !== 'grant' || typeof record.payload?.access_token !== 'string') {
        throw Object.assign(Error('GitHub 登录记录无效，请重新授权。'), {
          status: 401, reason: 'invalid_local', hasCredential: true
        });
      }
      return JSON.stringify(record.payload);
    },
    async write(plain, beforeCommit = () => {}) {
      const payload = JSON.parse(plain);
      await provider().modifyRecord(harnessCredentialKey, async () => {
        beforeCommit();
        return {kind: 'grant', payload};
      });
    },
    async remove() { await provider().deleteRecord(harnessCredentialKey); }
  };
}

export function credentialStore(root, seal) {
  if (seal || process.platform === 'win32') return fileCredentialStore(root, seal);
  if (process.platform === 'darwin') return macCredentialStore(root);
  const unsupported = () => { throw Error('此主机缺少受支持的 GitHub 凭据存储。'); };
  return {exists: async () => false, read: unsupported, write: unsupported, remove: unsupported};
}
