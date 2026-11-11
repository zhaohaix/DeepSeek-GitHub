import {test} from 'node:test';
import assert from 'node:assert/strict';
import {browserSearch} from '../src/browser-query.mjs';
test('官网仓库搜索编码中文与特殊字符，固定GitHub地址',()=>{
 const r=browserSearch({query:'PDF 工具 & type=code #test',language:'Python',minStars:'500',license:'mit',pushed:'2026-01-01',owner:'github',ownerType:'org',sort:'stars'}),u=new URL(r.url);
 assert.equal(u.origin,'https://github.com');assert.equal(u.pathname,'/search');assert.equal(u.searchParams.get('type'),'repositories');assert.equal(u.searchParams.get('s'),'stars');assert.match(u.searchParams.get('q'),/stars:>=500 license:mit pushed:>=2026-01-01/);assert.match(r.query,/org:github/);assert.match(r.query,/language:Python/);assert.equal(browserSearch({language:'Python',minStars:'500'}).query,'language:Python stars:>=500');
});
test('代码模式保留正则和symbol，忽略隐藏的仓库筛选',()=>{
 const r=browserSearch({query:'/parse[A-Z]\\w*/',type:'code',repo:'github/github-mcp-server',symbol:'parse',path:'src/My Files',language:'C++',minStars:'100',sort:'stars',license:'mit',pushed:'2026-01-01'});
 const u=new URL(r.url);assert.equal(u.searchParams.get('type'),'code');assert.equal(u.searchParams.has('s'),false);assert.match(r.query,/symbol:parse/);assert.ok(r.query.includes('path:"src/My Files"'));assert.ok(r.query.startsWith('/parse[A-Z]\\w*/'));assert.equal(/stars:|license:|pushed:/.test(r.query),false);
});
test('手写完整官网查询不改写，私有范围可明确选择',()=>{
 const query='(repo:one/demo OR repo:two/demo) NOT path:tests';assert.equal(browserSearch({query,type:'code'}).query,query);assert.equal(browserSearch({query:'test',visibility:'private'}).query,'test is:private');
});
test('非法输入拒绝生成外链，合法URL样式文本仍只是搜索词',()=>{
 for(const a of [{query:''},{query:'x\nsecret'},{query:'x',minStars:'-1'},{query:'x',pushed:'2026-02-30'},{query:'x',owner:'a repo:b'},{query:'x',type:'evil'},{query:'x',type:'code',repo:'../bad'}])assert.throws(()=>browserSearch(a));
 assert.equal(new URL(browserSearch({query:'https://evil.example/'}).url).hostname,'github.com');
});
