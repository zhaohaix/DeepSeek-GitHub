import{test}from'node:test';import assert from'node:assert/strict';import{mkdtemp,readFile,readdir}from'node:fs/promises';import os from'node:os';import path from'node:path';
import{Drafts}from'../src/drafts.mjs';
test('介绍与发布文案自动保存到 GitHub 工作区草稿，并能读回',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'gh-drafts-'));const d=new Drafts({root,now:()=>Date.parse('2026-01-02T03:04:05Z')});
 const r=await d.save({kind:'repository',description:'一个整理照片的工具'});assert.equal(r.savedAt,'2026-01-02T03:04:05.000Z');assert.equal(r.label,'新建仓库');
 assert.equal((await d.load({kind:'repository'})).description,'一个整理照片的工具');
 assert.match(await readFile(path.join(root,'workspace','drafts','new-repository.md'),'utf8'),/整理照片/);
 assert.equal(await d.load({kind:'release',owner:'me',repo:'demo'}),null);
 const p=await d.save({kind:'release',owner:'me',repo:'demo',title:'v1.0 首个版本',body:'- 新增导出'});assert.equal(p.label,'me/demo');
 const rel=await d.load({kind:'release',owner:'me',repo:'demo'});assert.equal(rel.body,'- 新增导出');assert.equal(rel.owner,'me');
 assert.match(await readFile(path.join(root,'workspace','drafts','me','demo.md'),'utf8'),/新增导出/);
 await d.clear({kind:'release',owner:'me',repo:'demo'});assert.equal(await d.load({kind:'release',owner:'me',repo:'demo'}),null);
 await assert.rejects(()=>readFile(path.join(root,'workspace','drafts','me','demo.md')),/ENOENT/);
});
test('草稿拒绝非法类型、超长内容和越界路径',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'gh-drafts-bad-'));const d=new Drafts({root});
 await assert.rejects(()=>d.save({kind:'other'}),/类型/);
 await assert.rejects(()=>d.save({kind:'repository',description:'x'.repeat(351)}),/350/);
 await assert.rejects(()=>d.save({kind:'release',repo:'demo'}),/仓库信息/);
 await d.save({kind:'release',owner:'../../etc',repo:'../passwd',title:'t',body:'b'});
 const names=await readdir(path.join(root,'workspace','drafts'));
 assert.deepEqual(names.filter(n=>n.includes('..')),[]);
 assert.equal((await d.load({kind:'release',owner:'../../etc',repo:'../passwd'})).title,'t');
});
