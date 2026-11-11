import{test}from'node:test';import assert from'node:assert/strict';import{Readable}from'node:stream';import{mkdtemp,mkdir}from'node:fs/promises';import os from'node:os';import path from'node:path';
import{routes,API}from'../src/http.mjs';
function fakeRes(){const out={status:0,headers:null,body:''};out.writeHead=(status,headers)=>{out.status=status;out.headers=headers;};out.end=value=>{out.body=value??'';};return out;}
const browserPeer={id:'browser'},connection=()=>({browserPeer,admit:()=>({peer:browserPeer})});
function request(){const req=Readable.from([Buffer.from('print(1)')]);req.method='POST';req.url=API+'upload';req.headers={host:'127.0.0.1:3080',origin:'http://127.0.0.1:3080','x-file-name':encodeURIComponent('main.py')};req.socket={remoteAddress:'127.0.0.1'};return req;}
test('新建仓库上传只作为 AI 阅读材料，不进发布附件；程序发布上传仍是发布附件',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'gh-upload-'));await mkdir(path.join(root,'attachments'),{recursive:true});const calls=[];
 const ops={addAsset:async(name,disk,id,purpose)=>{calls.push({name,purpose});return{id,name,size:8,purpose};}};
 const route=Object.fromEntries(routes({api:{},ops,auth:{},root,releaseCopy:null,connection}).map(r=>[r.path,r]));
 for(const [header,purpose] of [[{'x-file-purpose':'intro'},'intro'],[{},'release']]){
  const req=request();Object.assign(req.headers,header);const res=fakeRes();await route[API+'upload'].handler(req,res);
  assert.equal(res.status,200);assert.equal(calls.at(-1).purpose,purpose);
 }
 assert.deepEqual(calls.map(c=>c.purpose),['intro','release']);
});
test('上传接口拒绝非本机认证页面',async()=>{
 const route=Object.fromEntries(routes({api:{},ops:{},auth:{},root:'C:/tmp',releaseCopy:null,connection:()=>null}).map(r=>[r.path,r]));
 const res=fakeRes();await route[API+'upload'].handler(request(),res);assert.equal(res.status,403);
});
