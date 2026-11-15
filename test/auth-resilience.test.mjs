import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {GhAuth} from '../src/gh.mjs';
import {GitHub} from '../src/core.mjs';
const seal=async(action,value)=>action==='protect'?Buffer.from(value).toString('base64'):Buffer.from(value,'base64').toString();
async function fixture(fetchImpl){
 const root=await mkdtemp(path.join(os.tmpdir(),'gh-resilience-'));let time=0;const waits=[],events=[];
 const a=new GhAuth(root,{seal,fetchImpl,now:()=>time,sleep:async ms=>{waits.push(ms);time+=ms;},diagnostics:(event,fields)=>events.push({event,...fields})});
 a.clientId=async()=> 'test-client';return {a,root,waits,events};
}
const device={device_code:'private-device',user_code:'ABCD',interval:5,expires_in:900};
test('开始登录网络波动会重试；轮询掉线保留设备码并退避，恢复后完成',async()=>{
 let starts=0,polls=0;const f=await fixture(async url=>{
  if(url.endsWith('/code')){if(++starts===1)throw TypeError('fetch failed');return Response.json(device);}
  if(++polls<=2)throw TypeError('fetch failed');return Response.json({access_token:'private-token'});
 });
 await f.a.start();await f.a.task;assert.equal(f.a.login.state,'complete');assert.equal(starts,2);
 assert.deepEqual(f.waits,[1000,5000,10000,20000]);assert.equal(await f.a.token(),'private-token');
 assert.ok(f.events.some(e=>e.event==='oauth_retry'));assert.equal(JSON.stringify(f.events).includes('private-'),false);
});
test('slow_down 增加轮询间隔；永久断网在设备授权期限内结束',async()=>{
 let polls=0;const f=await fixture(async u=>Response.json(u.endsWith('/code')?device:++polls===1?{error:'slow_down',interval:12}:polls===2?{error:'authorization_pending'}:{access_token:'ok'}));
 await f.a.start();await f.a.task;assert.deepEqual(f.waits,[5000,12000,12000]);
 const g=await fixture(async u=>{if(u.endsWith('/code'))return Response.json({...device,expires_in:40});throw TypeError('fetch failed');});
 await g.a.start();await g.a.task;assert.equal(g.a.login.state,'error');assert.match(g.a.login.message,/过期/);assert.ok(g.waits.reduce((a,b)=>a+b,0)<=40000);
});
test('证书失败不重复请求，提示具体原因而不输出原始错误或代理密码',async()=>{
 let calls=0;const f=await fixture(async()=>{calls++;throw Object.assign(TypeError('private-proxy-password'),{cause:{code:'SELF_SIGNED_CERT_IN_CHAIN'}});});
 await f.a.start();await f.a.task;assert.equal(calls,1);assert.match(f.a.login.message,/证书/);assert.equal(f.a.login.message.includes('private'),false);
});
test('过期凭据自动续期且并发合并；新凭据与续期令牌一起加密存储',async()=>{
 let calls=0;const f=await fixture(async(_u,init)=>{calls++;const p=new URLSearchParams(init.body);assert.equal(p.get('grant_type'),'refresh_token');assert.equal(p.get('refresh_token'),'refresh-old');await new Promise(r=>setImmediate(r));return Response.json({access_token:'access-new',refresh_token:'refresh-new',expires_in:28800});});
 await f.a.save({access_token:'access-old',refresh_token:'refresh-old',expires_in:1},0,'test-client');
 assert.deepEqual(await Promise.all([f.a.token(),f.a.token()]),['access-new','access-new']);assert.equal(calls,1);
 assert.equal((await f.a.credential()).refresh_token,'refresh-new');assert.equal((await readFile(path.join(f.root,'credential.dpapi'),'utf8')).includes('refresh-new'),false);
});
test('GET 401 续期后只重放一次；写入请求不会自动重放',async()=>{
 let refresh=0,reads=0,writes=0;
 const api=new GitHub({auth:{token:async()=> 'old',refreshAfter401:async()=>{refresh++;return 'new';}},fetchImpl:async(_u,init)=>{if(init.method==='POST'){writes++;return Response.json({message:'bad'},{status:401});}reads++;return Response.json({message:'bad'},{status:401});}});
 await assert.rejects(()=>api.me(),/401/);assert.equal(reads,2);assert.equal(refresh,1);
 await assert.rejects(()=>api.request('/user/repos',{method:'POST',body:{name:'test'}}),/401/);assert.equal(writes,1);assert.equal(refresh,1);
});
test('取消登录后迟到的成功响应不能重新写入凭据',async()=>{
 let release,entered;const enteredPromise=new Promise(r=>entered=r),pending=new Promise(r=>release=r);
 const f=await fixture(async u=>{if(u.endsWith('/code'))return Response.json(device);entered();await pending;return Response.json({access_token:'late-token'});});
 await f.a.start();await enteredPromise;await f.a.logout();release();await f.a.task;assert.equal(await f.a.hasCredential(),false);assert.equal(f.a.login.state,'idle');
});
test('刷新失败不删除旧凭据；轮换请求网络失败不自动重放',async()=>{
 let calls=0;const f=await fixture(async()=>{calls++;throw TypeError('fetch failed');});
 await f.a.save({access_token:'old',refresh_token:'refresh',expires_in:1},0,'test-client');const before=await readFile(path.join(f.root,'credential.dpapi'),'utf8');
 await assert.rejects(()=>f.a.token(),/连接/);assert.equal(calls,1);assert.equal(await readFile(path.join(f.root,'credential.dpapi'),'utf8'),before);
});
