import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtemp,writeFile,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {GitHub,Operations} from '../src/core.mjs';

test('真实 HTTP 替身：个人建库 → 文本提交 → Release → 二进制附件上传',async t=>{
 const requests=[];let binary;const parent='a'.repeat(40);
 const server=createServer(async(req,res)=>{const chunks=[];for await(const b of req)chunks.push(b);const bytes=Buffer.concat(chunks);const url=new URL(req.url,'http://localhost');requests.push({method:req.method,path:url.pathname,body:bytes});assert.equal(req.headers.authorization,'Bearer fixture-token');let value={};
  if(url.pathname==='/user')value={id:10,login:'fixture-user'};
  else if(url.pathname==='/user/repos')value={id:1,name:'fixture-repo',html_url:'https://github.com/fixture-user/fixture-repo',default_branch:'main'};
  else if(url.pathname.endsWith('/git/ref/heads/main'))value={object:{sha:parent}};
  else if(url.pathname.endsWith('/git/commits/'+parent))value={tree:{sha:'base-tree'}};
  else if(url.pathname.endsWith('/git/trees/base-tree'))value={tree:[]};
  else if(url.pathname.endsWith('/git/trees'))value={sha:'tree2'};
  else if(url.pathname.endsWith('/git/commits'))value={sha:'commit2'};
  else if(url.pathname.endsWith('/releases')&&req.method==='POST')value={id:20,tag_name:JSON.parse(bytes).tag_name,html_url:'https://github.com/fixture-user/fixture-repo/releases/tag/v1.0.0'};
  else if(url.pathname.endsWith('/releases/20'))value={id:20};
  else if(url.pathname.endsWith('/releases/20/assets')){binary=bytes;value={id:30,name:url.searchParams.get('name'),size:bytes.length,browser_download_url:'https://github.com/fixture-user/fixture-repo/releases/download/v1.0.0/setup.zip'};}
  res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(value));
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>server.close());
 const base=`http://127.0.0.1:${server.address().port}`,root=await mkdtemp(path.join(os.tmpdir(),'dsh-github-test-'));
 const api=new GitHub({base,uploadBase:base,auth:{token:async()=> 'fixture-token'}}),ops=new Operations(api,{root});await ops.init();
 const create=await ops.prepare('create_repository',{name:'fixture-repo'});assert.equal(requests.filter(r=>r.method==='POST').length,0);assert.equal((await ops.confirm(create.operationId)).status,'completed');
 const commit=await ops.prepare('commit_files',{owner:'fixture-user',repo:'fixture-repo',branch:'main',baseCommit:parent,message:'publish source',files:[{path:'main.py',content:'print("hello")'}]});assert.equal((await ops.confirm(commit.operationId)).status,'completed');
 const release=await ops.prepare('create_release',{owner:'fixture-user',repo:'fixture-repo',tag_name:'v1.0.0',name:'首个版本',body:'更新说明',target_commitish:'main'});const result=await ops.confirm(release.operationId);assert.equal(result.result.id,20);
 const data=Buffer.from([0,1,2,255,0,128,42]),disk=path.join(root,'attachments','11111111-1111-1111-1111-111111111111');await writeFile(disk,data);
 const asset=await ops.addAsset('安装包.zip',disk,'11111111-1111-1111-1111-111111111111');const up=await ops.prepare('upload_asset',{owner:'fixture-user',repo:'fixture-repo',releaseId:20,assetId:asset.id});const uploaded=await ops.confirm(up.operationId);
 assert.equal(uploaded.status,'completed');assert.equal(uploaded.result.name,'安装包.zip');assert.deepEqual(binary,data);assert.equal(JSON.stringify(ops.list()).includes('fixture-token'),false);
 const metadata=await readFile(path.join(root,'attachments.json'),'utf8');assert.equal(metadata.includes('diskPath'),false);
});
