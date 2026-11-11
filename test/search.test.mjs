import {test} from 'node:test';
import assert from 'node:assert/strict';
import {searchGitHub} from '../src/search.mjs';
import {GitHub} from '../src/core.mjs';
import {definitions} from '../src/tools.mjs';
const publicRepo={owner:{login:'someone'},name:'project',full_name:'someone/project',private:false,html_url:'https://github.com/someone/project',stargazers_count:42,license:{spdx_id:'MIT'}};
test('公开仓库搜索编码关键词、过滤条件、排序及分页；拒绝非公开结果',async()=>{
 let seen;const api={request:async(route,options)=>{seen={route,options};return {total_count:21,incomplete_results:true,items:[publicRepo,{...publicRepo,private:true,name:'private-secret'}]};}};
 const r=await searchGitHub(api,'repositories',{query:'PDF工具 language:Python stars:>100',sort:'stars',page:2,perPage:10});const u=new URL(seen.route,'https://api.github.com');
 assert.equal(u.pathname,'/search/repositories');assert.equal(u.searchParams.get('q'),'PDF工具 language:Python stars:>100 is:public');assert.equal(u.searchParams.get('page'),'2');assert.equal(u.searchParams.get('sort'),'stars');assert.equal(r.results.length,1);assert.equal(r.filteredNonPublic,1);assert.equal(r.results[0].license,'MIT');assert.equal(r.hasMore,true);assert.equal(r.incomplete_results,true);assert.equal(JSON.stringify(r).includes('private-secret'),false);
});
test('代码搜索返回可继续读取的仓库与路径，片段有长度上限',async()=>{
 const r=await searchGitHub({request:async()=>({total_count:1,incomplete_results:false,items:[{name:'main.py',path:'src/main.py',sha:'hash',html_url:'https://github.com/someone/project/blob/main/src/main.py',repository:publicRepo,text_matches:[{fragment:'x'.repeat(1000)},{fragment:'retry()'},{fragment:'hidden third'}]}]})},'code',{query:'retry language:Python'});
 assert.equal(r.results[0].repository.owner,'someone');assert.equal(r.results[0].path,'src/main.py');assert.equal(r.results[0].fragments[0].length,400);assert.equal(r.results[0].fragments.length,2);assert.equal(r.hasMore,false);
});
test('非法条件不发请求；分页上限及空结果不伪造',async()=>{
 let calls=0;const api={request:async()=>{calls++;return {items:[],total_count:0};}};
 for(const args of [{query:''},{query:'x'.repeat(247)},{query:'x is:private'},{query:'x',page:101},{query:'x',perPage:31},{query:'x',order:'bad'},{query:'x',sort:'invalid'}])await assert.rejects(()=>searchGitHub(api,'repositories',args));assert.equal(calls,0);
 const r=await searchGitHub(api,'repositories',{query:'nothing'});assert.deepEqual(r.results,[]);assert.equal(r.hasMore,false);
});
test('真实GET传输保留认证、文本匹配与频率限制错误',async()=>{
 let count=0;const api=new GitHub({auth:{token:async()=> 'fixture-only'},fetchImpl:async(url,init)=>{assert.equal(init.method,'GET');assert.equal(init.headers.Authorization,'Bearer fixture-only');assert.match(init.headers.Accept,/text-match/);if(count++===0)return Response.json({total_count:0,items:[]});return Response.json({message:'API rate limit exceeded'},{status:403,headers:{'x-ratelimit-remaining':'0','retry-after':'60'}});}});
 await searchGitHub(api,'code',{query:'retry'});await assert.rejects(()=>searchGitHub(api,'code',{query:'retry'}),/60|rate limit/);
});
test('聊天能先搜索公开项目，再按返回路径读取；不触发写入',async()=>{
 const calls=[];const tools=definitions({request:async route=>{calls.push(route);return {total_count:1,items:[publicRepo]};},contents:async a=>{calls.push(a);return {content:'# public project'};}},{});const exec={agent:{id:'session-12345678-1234-1234-1234-123456789012'}};
 const first=await tools.find(t=>t.name==='github_search_repositories').execute({query:'pdf'},exec);assert.equal(first.isError,false);const repo=JSON.parse(first.content).results[0];const second=await tools.find(t=>t.name==='github_read').execute({owner:repo.owner,repo:repo.name,path:'README.md'},exec);assert.equal(JSON.parse(second.content).content,'# public project');assert.equal(calls.length,2);
});
