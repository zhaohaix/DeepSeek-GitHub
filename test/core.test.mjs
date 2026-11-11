import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,access} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {GitHub,Operations} from '../src/core.mjs';
test('超过1MiB的文本使用 raw 媒体读取，保留2MiB上限',async()=>{
 const content='x'.repeat(1536*1024);const api=new GitHub({auth:{token:async()=> 'fixture'},fetchImpl:async(url,init)=>url.includes('/commits/')?Response.json({sha:'a'.repeat(40)}):init.headers.Accept==='application/vnd.github.raw+json'?new Response(content):Response.json({type:'file',size:content.length,encoding:'none',path:'large.txt'})});
 assert.equal((await api.contents({owner:'me',repo:'demo',path:'large.txt'})).content.length,content.length);
});

test('仓库读取使用授权头，文件正确解码，错误不得报告成功',async()=>{
  const urls=[];const api=new GitHub({auth:{token:async()=> 'test-only-token'},fetchImpl:async(url,init)=>{urls.push(url);assert.equal(init.headers.Authorization,'Bearer test-only-token');if(url.includes('/commits/'))return Response.json({sha:'a'.repeat(40)});return Response.json({type:'file',path:'README.md',sha:'abc',size:5,encoding:'base64',content:Buffer.from('你好').toString('base64')});}});
  const result=await api.contents({owner:'me',repo:'demo',path:'README.md',ref:'feature/test'});assert.equal(result.content,'你好');assert.match(urls[0],/feature%2Ftest/);assert.equal(result.commit_sha,'a'.repeat(40));
  await assert.rejects(()=>api.contents({owner:'me',repo:'demo',path:'../secret'}),/路径/);
  const bad=new GitHub({auth:{token:async()=> 'test'},fetchImpl:async()=>Response.json({message:'Bad credentials'},{status:401})});await assert.rejects(()=>bad.me(),/401/);
});
test('准备写入不发出变更；确认一次才执行，拒绝跨账号与组织写入',async()=>{
  let current={id:1,login:'me'},writes=0;const api={me:async()=>current,request:async()=>{writes++;return {id:5,html_url:'https://github.com/me/demo'};}};
  const ops=new Operations(api,{});const p=await ops.prepare('create_repository',{name:'demo'});assert.equal(writes,0);assert.equal(ops.status(p.operationId).args.private,false);
  const r=await ops.confirm(p.operationId);assert.equal(r.status,'completed');assert.equal(writes,1);await assert.rejects(()=>ops.confirm(p.operationId),/重复/);
  await assert.rejects(()=>ops.prepare('commit_files',{owner:'org',repo:'demo'}),/个人仓库/);
  const q=await ops.prepare('create_repository',{name:'other'});current={id:2,login:'other'};assert.equal((await ops.confirm(q.operationId)).status,'failed');assert.equal(writes,1);
});
test('并发确认只执行一次，过期和取消不执行',async()=>{
  let writes=0,t=0;const ops=new Operations({me:async()=>({id:1,login:'me'}),request:async()=>{writes++;return {}; }},{now:()=>t});
  const p=await ops.prepare('create_repository',{name:'demo'});const r=await Promise.allSettled([ops.confirm(p.operationId),ops.confirm(p.operationId)]);assert.equal(writes,1);assert.equal(r.filter(x=>x.status==='rejected').length,1);
  const q=await ops.prepare('create_repository',{name:'expired'});t=1800001;await assert.rejects(()=>ops.confirm(q.operationId),/30 分钟/);
  const x=await ops.prepare('create_repository',{name:'cancelled'});ops.reject(x.operationId);await assert.rejects(()=>ops.confirm(x.operationId));assert.equal(writes,1);
});

test('AI 介绍用文件与发布附件分开管理，移除时删除暂存文件',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'gh-assets-'));const ops=new Operations({}, {root});await ops.init();
 const file=path.join(root,'main.py');await writeFile(file,'print("demo")');
 const intro=await ops.addAsset('main.py',file,undefined,'intro');
 assert.deepEqual(ops.assetList(),[]);assert.equal(ops.assetList('intro').length,1);assert.equal(ops.assetList('intro')[0].purpose,'intro');
 const release=await ops.addAsset('setup.zip',file);assert.equal(ops.assetList().length,1);assert.equal(ops.assetList()[0].id,release.id);
 await assert.rejects(()=>ops.addAsset('other.txt',file,undefined,'unknown'),/用途/);
 await ops.removeAsset(intro.id);assert.equal(ops.assetList('intro').length,0);await assert.rejects(()=>access(file));
});
test('超过一天的 AI 阅读材料在初始化时清掉，发布附件保留',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'gh-prune-'));await mkdir(path.join(root,'attachments'),{recursive:true});
 const old={id:'11111111-1111-1111-1111-111111111111',name:'old.zip',size:1,purpose:'intro',createdAt:new Date(Date.now()-2*86400000).toISOString()};
 const fresh={id:'22222222-2222-2222-2222-222222222222',name:'new.zip',size:1,purpose:'intro',createdAt:new Date().toISOString()};
 const keep={id:'33333333-3333-3333-3333-333333333333',name:'release.zip',size:1,createdAt:new Date(Date.now()-5*86400000).toISOString()};
 for(const a of [old,fresh,keep])await writeFile(path.join(root,'attachments',a.id),'x');
 await writeFile(path.join(root,'attachments.json'),JSON.stringify([old,fresh,keep]));
 const ops=new Operations({}, {root});await ops.init();
 assert.deepEqual(ops.assetList('intro').map(a=>a.id),[fresh.id]);assert.deepEqual(ops.assetList().map(a=>a.id),[keep.id]);
 await assert.rejects(()=>access(path.join(root,'attachments',old.id)));
});