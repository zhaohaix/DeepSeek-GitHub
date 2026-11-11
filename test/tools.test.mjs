import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Operations,GitHub} from '../src/core.mjs';
import {definitions,localAgent} from '../src/tools.mjs';
import {admitted} from '../src/http.mjs';
import {GhAuth} from '../src/gh.mjs';
import {windowsSeal} from '../src/gh.mjs';
import {mkdtemp,readFile,access} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('工具覆盖首版范围，没有模型可调用的确认工具，阻止 IM 会话',async()=>{
 const tools=definitions({me:async()=>({login:'me'})},{assetList:()=>[]});assert.equal(tools.length,12);assert.equal(tools.some(t=>/confirm/.test(t.name)),false);
 assert.equal(localAgent({id:'wechat:group:1'}),false);await assert.rejects(()=>tools[0].execute({}, {agent:{id:'wechat:group:1'}}));
 const r=await tools[0].execute({}, {agent:{id:'session-12345678-1234-1234-1234-123456789012'}});assert.equal(r.isError,false);
});
test('HTTP 必须通过宿主认证并拒绝跨站与远程连接',()=>{
 const base={headers:{host:'127.0.0.1:3080',origin:'http://127.0.0.1:3080'},socket:{remoteAddress:'127.0.0.1'}};
 const browserPeer={id:'browser'},connection={browserPeer,admit:()=>({peer:browserPeer})};
 assert.equal(admitted(base,null),false);assert.equal(admitted(base,{...connection,admit:()=>({rejection:401})}),false);assert.equal(admitted(base,connection),true);
 assert.equal(admitted(base,{...connection,admit:()=>({peer:{id:'api',interactions:'none'}})}),false);
 assert.equal(admitted({...base,headers:{...base.headers,origin:'https://evil.example'}},connection),false);
 assert.equal(admitted({...base,socket:{remoteAddress:'192.168.1.5'}},connection),false);
});
test('多文件提交保留基础树且不强制覆盖分支',async()=>{
 const calls=[];const api=new GitHub();api.request=async(route,opts)=>{calls.push({route,...opts});if(route.includes('/ref/heads/'))return {object:{sha:'parent'}};if(route.endsWith('/commits/parent'))return {tree:{sha:'base-tree'}};if(route.endsWith('/trees/base-tree'))return {tree:[{path:'README.md',type:'blob',mode:'100755'}]};if(route.endsWith('/trees'))return {sha:'new-tree'};if(route.endsWith('/commits'))return {sha:'new-commit'};return {};};
 await api.commitFiles({owner:'me',repo:'demo',branch:'main',baseCommit:'parent',message:'add files',files:[{path:'README.md',content:'hello'},{path:'src/main.py',content:'print(1)'}]});
 assert.equal(calls[3].body.base_tree,'base-tree');assert.equal(calls[3].body.tree.length,2);assert.equal(calls[3].body.tree[0].mode,'100755');assert.equal(calls[5].body.force,false);
 await assert.rejects(()=>api.commitFiles({owner:'me',repo:'demo',branch:'main',baseCommit:'outdated'}),/已更新/);
});
test('Release 准备保留版本与更新说明，上传只能引用选定附件',async()=>{
 const api={me:async()=>({id:1,login:'me'}),request:async(route,opts)=>({id:4,tag_name:opts.body.tag_name,html_url:'https://github.com/me/demo/releases/tag/v1'})};
 const ops=new Operations(api,{});const p=await ops.prepare('create_release',{owner:'me',repo:'demo',tag_name:'v1',body:'更新说明',target_commitish:'master'});assert.equal(ops.status(p.operationId).args.target_commitish,'master');assert.equal((await ops.confirm(p.operationId)).result.tag_name,'v1');
 await assert.rejects(()=>ops.prepare('upload_asset',{owner:'me',repo:'demo',releaseId:4,assetId:'missing'}),/选择/);
});
test('独立设备授权不调用 CLI 或共享凭据，使用 Windows DPAPI 保存',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'dsh-auth-test-'));const urls=[];
 const auth=new GhAuth(root,{sleep:async()=>{},fetchImpl:async(url,init)=>{urls.push(url);const fields=new URLSearchParams(init.body);assert.equal(fields.get('client_id'),'fixture-client');return Response.json(url.endsWith('/code')?{device_code:'fixture-device',user_code:'ABCD-1234',expires_in:900,interval:5}:{access_token:'fixture-token'});}});
 await assert.rejects(()=>auth.token(),/登录/);await auth.configure('fixture-client');await auth.start();await auth.task;assert.equal(auth.login.state,'complete');assert.equal(await auth.token(),'fixture-token');assert.equal((await readFile(path.join(root,'credential.dpapi'),'utf8')).includes('fixture-token'),false);assert.equal(urls.length,2);await auth.logout();await assert.rejects(()=>auth.token(),/登录/);
});
test('缺少发布者 Client ID 时明确失败，不复用已有 GitHub 登录',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'dsh-auth-empty-'));const auth=new GhAuth(root);auth.clientId=async()=>'';await assert.rejects(()=>auth.start(),/Client ID/);
});
