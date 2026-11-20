import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,stat} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {GhAuth} from '../src/gh.mjs';
import {command,macCredentialStore} from '../src/credential-store.mjs';

test('macOS 钥匙串后端只通过 stdin 传令牌，并按 DSH_HOME 隔离', async () => {
  const entries = new Map();
  const run = async (executable, args, {input} = {}) => {
    assert.equal(executable, '/usr/bin/security');
    assert.equal(args.some(arg => arg.includes('fixture-token')), false);
    if (input) {
      assert.deepEqual(args, ['-q','-i']);
      const match = input.match(/"([a-f0-9]{64})" "-U" "-w" "(v1\.[^"]+)"\n$/);
      assert.ok(match);
      entries.set(match[1], match[2]);
      return {code: 0, stdout: ''};
    }
    const account = args[args.indexOf('-a') + 1];
    if (!entries.has(account)) return {code: 44, stdout: ''};
    if (args[0] === 'delete-generic-password') entries.delete(account);
    return {code: 0, stdout: args.includes('-w') ? entries.get(account) + '\n' : 'metadata'};
  };
  const root = path.join(tmpdir(), 'dsh-keychain-fixture');
  const auth = new GhAuth(root, {credentialStore: macCredentialStore(root, {run})});
  await auth.save({access_token:'fixture-token',refresh_token:'fixture-refresh'}, 0, 'fixture-client');
  const reopened = new GhAuth(root, {credentialStore: macCredentialStore(root, {run})});
  assert.equal(await reopened.token(), 'fixture-token');
  assert.equal((await reopened.credential()).refresh_token, 'fixture-refresh');
  assert.equal(await macCredentialStore(root + '-other', {run}).exists(), false);
  await reopened.logout();
  assert.equal(await auth.hasCredential(), false);
  await reopened.logout();
});

test('macOS 钥匙串不可访问时提供恢复提示，退出失败能报告给用户', async () => {
  const root = tmpdir();
  const run = async () => ({code: 36, stdout: 'fixture-sensitive-output'});
  const auth = new GhAuth(root, {credentialStore: macCredentialStore(root, {run})});
  await assert.rejects(() => auth.token(), {status:503, reason:'keychain_unavailable', message:/解锁/});
  await assert.rejects(() => auth.logout(), /钥匙串/);
});

test('真实 macOS 钥匙串保存、跨进程读取、更新轮换后的凭据并退出', {
  skip: process.platform !== 'darwin', timeout: 60000
}, async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dsh-keychain-'));
  const keychain = path.join(root, 'test keychain.keychain-db');
  const security = async (...args) => {
    const result = await command('/usr/bin/security', args);
    assert.equal(result.code, 0, 'security ' + args[0] + ' failed');
  };
  try {
    await security('create-keychain', '-p', 'fixture-password', keychain);
    await security('unlock-keychain', '-p', 'fixture-password', keychain);
    const auth = new GhAuth(root, {credentialStore: macCredentialStore(root, {keychain})});
    await auth.save({access_token:'fixture-token',refresh_token:'fixture-refresh'}, 0, 'fixture-client');
    await assert.rejects(stat(path.join(root,'credential.dpapi')), {code:'ENOENT'});
    const script = `
      import assert from 'node:assert/strict';
      import {GhAuth} from './src/gh.mjs';
      import {macCredentialStore} from './src/credential-store.mjs';
      const [root,keychain] = process.argv.slice(1);
      const a = new GhAuth(root,{credentialStore:macCredentialStore(root,{keychain})});
      assert.equal(await a.token(),'fixture-token');
      assert.equal((await a.credential()).refresh_token,'fixture-refresh');
    `;
    await promisify(execFile)(process.execPath, ['--input-type=module','-e',script,root,keychain], {timeout:30000});
    await auth.save({access_token:'fixture-rotated',refresh_token:'fixture-new-refresh'}, 0, 'fixture-client');
    assert.equal(await auth.token(), 'fixture-rotated');
    await auth.logout();
    assert.equal(await auth.hasCredential(), false);
    await auth.logout();
  } finally {
    await command('/usr/bin/security', ['delete-keychain', keychain]).catch(() => {});
    await rm(root, {recursive:true,force:true});
  }
});
