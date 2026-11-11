import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,unlink} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {GhAuth,windowsSeal} from '../src/gh.mjs';
import {GitHub} from '../src/core.mjs';
import {createDiagnostics} from '../src/diagnostics.mjs';
const root=()=>mkdtemp(path.join(os.tmpdir(),'github-login-diagnostics-'));
const logs=async r=>(await readFile(path.join(r,'diagnostics.jsonl'),'utf8')).trim().split('\n').map(JSON.parse);
async function saved(){const r=await root();await writeFile(path.join(r,'credential.dpapi'),await windowsSeal('protect','fixture-auth-token'));return r;}

test('缺少凭据、文件损坏、空凭据分别留下脱敏原因',async()=>{
 const r=await root(),diagnostics=createDiagnostics(r),auth=new GhAuth(r,{diagnostics});await assert.rejects(()=>auth.token());assert.equal((await logs(r)).at(-1).reason,'missing');
 await writeFile(path.join(r,'credential.dpapi'),'corrupted-file-not-a-token');await assert.rejects(()=>auth.token(),/解密/);assert.equal((await logs(r)).at(-1).reason,'decrypt_failed');
 await writeFile(path.join(r,'credential.dpapi'),await windowsSeal('protect',''));await assert.rejects(()=>auth.token(),/为空/);assert.equal((await logs(r)).at(-1).reason,'invalid_local');
});
test('Windows DPAPI在独立Node进程重启后仍可解密；切换存储目录时看不到凭据',async()=>{
 const r=await saved(),moduleUrl=pathToFileURL(path.resolve('src/gh.mjs')).href;
 const code=`const {GhAuth}=await import(process.argv[1]);const a=new GhAuth(process.argv[2]);if(await a.token()!=='fixture-auth-token')process.exit(2);console.log('credential-survives-process-restart');`;
 const result=await promisify(execFile)(process.execPath,['--input-type=module','-e',code,moduleUrl,r],{windowsHide:true});assert.match(result.stdout,/survives/);
 const other=await root(),a=new GhAuth(other,{diagnostics:createDiagnostics(other)});await assert.rejects(()=>a.token());assert.equal((await logs(other)).at(-1).reason,'missing');
 assert.equal(await new GhAuth(r).token(),'fixture-auth-token');
});
test('模拟其他Windows用户无法解密，诊断明确且文件保留',async()=>{
 const r=await saved(),before=await readFile(path.join(r,'credential.dpapi'));
 const a=new GhAuth(r,{diagnostics:createDiagnostics(r),seal:async()=>{throw Error('different account / DPAPI failure');}});await assert.rejects(()=>a.token(),/解密/);assert.deepEqual(await readFile(path.join(r,'credential.dpapi')),before);assert.equal((await logs(r)).at(-1).reason,'decrypt_failed');
});
for(const [status,reason,headers]of [[401,'invalid_credentials',{}],[403,'forbidden',{}],[429,'rate_limited',{'retry-after':'60'}],[403,'rate_limited',{'x-ratelimit-remaining':'0'}],[500,'server_error',{}]])test(`GitHub HTTP ${status}/${reason} 不会删除本地凭据`,async()=>{
 const r=await saved(),diagnostics=createDiagnostics(r),auth=new GhAuth(r,{diagnostics}),before=await readFile(path.join(r,'credential.dpapi'));
 const api=new GitHub({auth,diagnostics,fetchImpl:async()=>Response.json({message:'fixture failure'},{status,headers})});await assert.rejects(()=>api.me());assert.deepEqual(await readFile(path.join(r,'credential.dpapi')),before);
 assert.equal((await logs(r)).at(-1).reason,reason);
});
for(const name of ['TypeError','TimeoutError'])test(`网络${name}不会清除授权，网络恢复即可继续`,async()=>{
 const r=await saved(),diagnostics=createDiagnostics(r),auth=new GhAuth(r,{diagnostics});let failed=true;
 const api=new GitHub({auth,diagnostics,fetchImpl:async()=>{if(failed){const e=Error('fixture private message must not be logged');e.name=name;throw e;}return Response.json({id:1,login:'fixture-user'});}});
 await assert.rejects(()=>api.me());assert.equal((await logs(r)).at(-1).reason,name==='TimeoutError'?'timeout':'network_error');failed=false;assert.equal((await api.me()).id,1);assert.equal((await logs(r)).at(-1).reason,'ok');assert.equal(await auth.hasCredential(),true);
});
test('只有主动断开会删除本地凭据，并记录断开事件',async()=>{
 const r=await saved(),auth=new GhAuth(r,{diagnostics:createDiagnostics(r)});await auth.logout();assert.equal(await auth.hasCredential(),false);assert.equal((await logs(r)).at(-1).event,'logout');
});
test('日志字段白名单拒绝Token/设备码/URL/正文；相同轮询事件合并',async()=>{
 const r=await root();let time=0;const d=createDiagnostics(r,{now:()=>time});const fields={category:'account',reason:'invalid_credentials',status:401,token:'SECRET-TOKEN',device_code:'SECRET-DEVICE',user_code:'SECRET-CODE',url:'https://example.com/private',message:'SECRET-MESSAGE'};
 d('api_response',fields);d('api_response',fields);time=61000;d('api_response',fields);d('SECRET-EVENT',fields);const text=await readFile(path.join(r,'diagnostics.jsonl'),'utf8');assert.equal(text.includes('SECRET'),false);assert.equal(text.includes('example.com'),false);assert.equal((await logs(r)).length,2);
});
for(const reason of ['access_denied','expired_token','device_flow_disabled'])test(`设备授权${reason}不会破坏原有凭据`,async()=>{
 const r=await saved(),before=await readFile(path.join(r,'credential.dpapi'));const auth=new GhAuth(r,{diagnostics:createDiagnostics(r),sleep:async()=>{},fetchImpl:async url=>Response.json(reason==='device_flow_disabled'||!url.endsWith('/code')?{error:reason,error_description:'fixture failure'}:{device_code:'SECRET-device',user_code:'SECRET-user',interval:5,expires_in:900})});auth.clientId=async()=> 'fixture-client';await auth.start();await auth.task;
 assert.equal(auth.login.state,'error');assert.deepEqual(await readFile(path.join(r,'credential.dpapi')),before);assert.equal((await logs(r)).at(-1).reason,reason);
});
test('并发点击登录只发起一组设备授权请求',async()=>{
 const r=await root();let calls=0;const auth=new GhAuth(r,{sleep:async()=>{},fetchImpl:async()=>{calls++;return Response.json({error:'device_flow_disabled'});}});auth.clientId=async()=>{await new Promise(resolve=>setTimeout(resolve,10));return 'fixture-client';};await Promise.all([auth.start(),auth.start()]);await auth.task;assert.equal(calls,1);
});
