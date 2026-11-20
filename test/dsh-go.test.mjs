import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {GhAuth} from '../src/gh.mjs';
import {harnessCredentialStore} from '../src/credential-store.mjs';
import {registerMobilePanel} from '../src/dsh-go.mjs';

test('DSH Go configures device login, restores and renews the grant, and shares logout with Web', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dsh-go-github-'));
  const records = new Map([['model-provider/existing', {kind:'grant',payload:{example:true}}]]);
  const provider = {
    describeRecord: async key => ({configured: records.has(key)}),
    readRecord: async key => records.get(key),
    modifyRecord: async (key, update) => records.set(key, await update(records.get(key))),
    deleteRecord: async key => records.delete(key)
  };
  const store = () => harnessCredentialStore(() => provider);
  let now = 0, finishLogin, startedPolling, pendingCleared = false;
  const approval = new Promise(resolve => { finishLogin = resolve; });
  const waiting = new Promise(resolve => { startedPolling = resolve; });
  const fetchImpl = async (url, request) => {
    if (url.endsWith('/device/code')) {
      return Response.json({device_code:'internal-device-id',user_code:'TEST-1234',interval:5,expires_in:900});
    }
    if (request.body.get('grant_type') === 'refresh_token') {
      assert.equal(request.body.get('refresh_token'), 'fixture-refresh');
      return Response.json({access_token:'rotated-access',refresh_token:'rotated-refresh',expires_in:28800});
    }
    startedPolling();
    await approval;
    return Response.json({access_token:'fixture-access',refresh_token:'fixture-refresh',expires_in:28800});
  };
  const auth = new GhAuth(root, {credentialStore:store(),fetchImpl,now:()=>now,sleep:async()=>{}});
  let panel;
  registerMobilePanel({dshGo:{panel(id,config){assert.equal(id,'github-account');panel=config;}}}, {
    auth, api:{me:async()=>({login:'tester'})}, ops:{clearPending(){pendingCleared=true;}}
  });
  const states = [];
  const dispose = panel.data({}, state => states.push(state));
  try {
    const save = panel.actions.configure({}, {value:{values:{'data.form.clientId':'fixture-client'}}});
    assert.equal((await save.result()).text,'Client ID 已保存');
    await panel.actions.login();
    await waiting;
    assert.equal(auth.login.state,'waiting');
    assert.deepEqual(panel.actions.authorize(),{type:'link',url:'https://github.com/login/device'});
    assert.deepEqual(panel.actions['copy-code'](),{type:'copy',text:'TEST-1234'});
    finishLogin();
    await auth.task;
    assert.equal(auth.login.state,'complete');
    await panel.actions.refresh().result();
    assert.equal(states.at(-1).status,'已连接 @tester');
    assert.doesNotMatch(JSON.stringify(states),/fixture-access|fixture-refresh|internal-device-id/);
    assert.equal((await readFile(path.join(root,'oauth.json'),'utf8')).includes('fixture-access'),false);
    const reopened = new GhAuth(root,{credentialStore:store(),fetchImpl,now:()=>now});
    assert.equal(await reopened.token(),'fixture-access');
    now = 28800000;
    assert.equal(await reopened.token(),'rotated-access');
    assert.equal(panel.actions.disconnect({}, {value:{confirmed:false}}),undefined);
    await panel.actions.disconnect({}, {value:{confirmed:true}}).result();
    assert.equal(await reopened.hasCredential(),false);
    assert.equal(pendingCleared,true);
    assert.deepEqual([...records.keys()],['model-provider/existing']);
  } finally {
    finishLogin();
    dispose();
  }
});

test('Linux without the Harness credential service fails without saving plaintext fallback', async () => {
  const store = harnessCredentialStore(() => undefined);
  await assert.rejects(()=>store.write('{"access_token":"fixture-token"}'),{status:503});
});
