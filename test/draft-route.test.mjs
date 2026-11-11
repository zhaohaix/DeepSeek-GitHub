import{test}from'node:test';import assert from'node:assert/strict';import{Readable}from'node:stream';import{mkdtemp}from'node:fs/promises';import os from'node:os';import path from'node:path';
import{routes,API}from'../src/http.mjs';import{Drafts}from'../src/drafts.mjs';
const browserPeer={id:'browser'},connection=()=>({browserPeer,admit:()=>({peer:browserPeer})});
function fakeRes(){const out={status:0,body:''};out.writeHead=status=>{out.status=status;};out.end=value=>{out.body=value??'';};return out;}
async function post(route,payload){const req=Readable.from([Buffer.from(JSON.stringify(payload))]);req.method='POST';req.headers={host:'127.0.0.1:3080',origin:'http://127.0.0.1:3080'};req.socket={remoteAddress:'127.0.0.1'};const res=fakeRes();await route(req,res);return{status:res.status,data:JSON.parse(res.body||'{}')};}
test('草稿接口保存、读回、清除，并经本机会话鉴权',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'gh-draft-route-'));const map=Object.fromEntries(routes({api:{},ops:{},auth:{},root,drafts:new Drafts({root}),connection}).map(r=>[r.path,r.handler]));
 const saved=await post(map[API+'draft/save'],{kind:'repository',description:'照片整理工具'});assert.equal(saved.status,200);assert.ok(saved.data.savedAt);
 const loaded=await post(map[API+'draft/get'],{kind:'repository'});assert.equal(loaded.data.description,'照片整理工具');
 await post(map[API+'draft/clear'],{kind:'repository'});assert.equal((await post(map[API+'draft/get'],{kind:'repository'})).data,null);
 const denied=Object.fromEntries(routes({api:{},ops:{},auth:{},root,drafts:new Drafts({root}),connection:()=>null}).map(r=>[r.path,r.handler]));
 assert.equal((await post(denied[API+'draft/save'],{kind:'repository',description:'x'})).status,403);
});
