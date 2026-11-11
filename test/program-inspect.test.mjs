import{test}from'node:test';import assert from'node:assert/strict';import{mkdtemp,writeFile,readFile,truncate}from'node:fs/promises';import path from'node:path';import os from'node:os';
import{inspectProgram}from'../src/program-inspect.mjs';import{ReleaseCopy}from'../src/release-copy.mjs';import{makeZip}from'./zip-fixture.mjs';
async function staged(root,name,data){const file=path.join(root,`${Math.random().toString(16).slice(2)}-${name}`);await writeFile(file,data);return{name,size:Buffer.byteLength(data),diskPath:file};}
const opsOf=async(root,entries)=>({assets:new Map(await Promise.all(Object.entries(entries).map(async([id,[name,data]])=>[id,await staged(root,name,data)])))});
test('读取真实ZIP内的源码和说明，跳过依赖/图片/凭据，只把读到的文本交给模型',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'program-inspect-'));
 const zip=makeZip([{name:'README.md',data:'# PDF页数统计工具\n读取PDF并统计页数'},{name:'src/main.py',data:'print("真实源码证据")'},{name:'node_modules/lib/index.js',data:'console.log("依赖代码")'},{name:'assets/logo.png',data:Buffer.from([137,80,78,71,0,1,2,3])},{name:'assets\\tiny.bin',data:Buffer.from([0,1,2,3,4])},{name:'credentials.txt',data:'gho_'+'A'.repeat(35)}],{compress:true});
 const ops=await opsOf(root,{source:['source.zip',zip]});const data=await inspectProgram(ops,['source']);
 assert.match(data.files.map(f=>f.text).join('\n'),/真实源码证据/);assert.doesNotMatch(data.files.map(f=>f.text).join('\n'),/依赖代码|console\.log/);
 assert.match(data.readFiles.join(','),/main\.py/);assert.ok(!data.readFiles.some(n=>/node_modules|logo\.png|credentials|tiny\.bin/.test(n)));
 let prompt;const generator=new ReleaseCopy({api:{},ops,root,ctx:{get:()=>null},generate:async(_,a)=>{prompt=a.input;return{text:'这是一个读取 PDF 并统计页数的工具。',model:'fixture'};}});
 const r=await generator.describeProgram({assetIds:['source'],repoName:'pdf-tool'});
 assert.match(prompt,/真实源码证据/);assert.doesNotMatch(prompt,/依赖代码/);assert.match(await readFile(r.draftPath,'utf8'),/PDF/);assert.equal(r.model,'fixture');
});
test('加密或损坏的ZIP不会把二进制当源码',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'program-zipbad-'));
 const encrypted=await opsOf(root,{secret:['enc.zip',makeZip([{name:'main.py',data:'print(1)'}],{encrypted:true})]});
 await assert.rejects(()=>inspectProgram(encrypted,['secret']),/源码或说明/);
 const broken=await opsOf(root,{broken:['broken.zip',Buffer.from('这不是 ZIP')]});
 await assert.rejects(()=>inspectProgram(broken,['broken']),/ZIP/);
 const unsafe=await opsOf(root,{unsafe:['unsafe.zip',makeZip([{name:'../evil.md',data:'# 逃逸'}])]});
 await assert.rejects(()=>inspectProgram(unsafe,['unsafe']),/不安全的文件路径/);
});
test('直接传入的文本可读；凭据、二进制和未知附件都被拒绝且不调用模型',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'program-binary-'));
 const ops=await opsOf(root,{notes:['notes.md','这是一个把截图整理成相册的命令行工具。'],secret:['credentials.txt','gho_'+'A'.repeat(35)],binary:['helpful-app.exe',Buffer.from([77,90,0,1,0,255])]});
 assert.match((await inspectProgram(ops,['notes'])).files[0].text,/整理成相册/);
 await assert.rejects(()=>inspectProgram(ops,['secret']),/源码或说明/);
 await assert.rejects(()=>inspectProgram(ops,['binary']),/安装包/);
 await assert.rejects(()=>inspectProgram(ops,['unknown']),/不存在/);
 await assert.rejects(()=>inspectProgram(ops,[]),/先传入/);
 let calls=0;const service=new ReleaseCopy({api:{},root,ops,ctx:{get:()=>null},generate:async()=>{calls++;return{text:'不能生成'};}});
 await assert.rejects(()=>service.describeProgram({assetIds:['binary']}),/安装包/);assert.equal(calls,0);
});
test('过大的ZIP被拒绝，过多文件被截断到上限',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'program-zipsize-'));
 const big=path.join(root,'big.zip');await writeFile(big,Buffer.alloc(1024));await truncate(big,33*1024*1024);
 await assert.rejects(()=>inspectProgram({assets:new Map([['big',{name:'big.zip',size:33*1024*1024,diskPath:big}]])},['big']),/32 MiB/);
 const many=await opsOf(root,{many:['many.zip',makeZip(Array.from({length:40},(_,i)=>({name:`doc${i}.md`,data:`第 ${i} 份说明`})))]});
 const data=await inspectProgram(many,['many']);assert.ok(data.files.length>0&&data.files.length<=24);
});
test('AI 介绍去掉Markdown围栏，超长或空内容要求重试',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'program-copy-'));
 const ops=await opsOf(root,{src:['main.py','print("统计照片数量")']});
 const fenced=new ReleaseCopy({api:{},ops,root,ctx:{get:()=>null},generate:async()=>({text:'```\n# 标题\n这是一个统计照片数量的脚本。\n```'})});
 const r=await fenced.describeProgram({assetIds:['src']});assert.equal(r.text,'这是一个统计照片数量的脚本。');
 const long=new ReleaseCopy({api:{},ops,root,ctx:{get:()=>null},generate:async()=>({text:'长'.repeat(400)})});
 await assert.rejects(()=>long.describeProgram({assetIds:['src']}),/350/);
});
