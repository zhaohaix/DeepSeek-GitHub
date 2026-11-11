import yauzl from 'yauzl';import{readFile,stat}from'node:fs/promises';import path from'node:path';
const textTypes=/\.(md|txt|py|js|ts|jsx|tsx|java|kt|go|rs|c|cpp|h|cs|swift|rb|php|sh|bat|ps1|html|css|json|ya?ml|toml|xml|gradle|properties|ini)$/i;
const readable=n=>textTypes.test(n)&&!/(^|\/)(node_modules|\.git|vendor|build|dist|\.venv)\//i.test(n)&&!/(^|\/)(\.env[^/]*|id_rsa|credentials[^/]*|package-lock\.json|pnpm-lock\.yaml)$/i.test(n);
const decode=b=>{if(b.includes(0))return null;try{const s=new TextDecoder('utf-8',{fatal:true}).decode(b);if(/gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{20,}|-----BEGIN .*PRIVATE KEY-----/.test(s))return null;return s;}catch{return null;}};
function zipTexts(buffer){return new Promise((resolve,reject)=>{yauzl.fromBuffer(buffer,{lazyEntries:true,validateEntrySizes:true},(error,zip)=>{
 if(error)return reject(Error('ZIP无法读取或已损坏，请重新打包为ZIP。'));const files=[],names=[];let total=0,count=0,done=false;
 const finish=(error)=>{if(done)return;done=true;zip.close();error?reject(error):resolve({files,names,truncated:count>=2000||files.length>=24});};
 zip.on('error',()=>finish(Error('ZIP解压读取失败。')));zip.on('end',()=>finish());zip.on('entry',e=>{if(++count>2000)return finish();if(names.length<120)names.push(e.fileName);if(files.length>=24||total>=512*1024)return finish();
  if(!readable(e.fileName)||e.uncompressedSize>200*1024||e.uncompressedSize+total>512*1024||(e.generalPurposeBitFlag&1)){zip.readEntry();return;}
  zip.openReadStream(e,(err,stream)=>{if(err)return finish(Error('ZIP文本条目无法读取。'));let size=0;const chunks=[];stream.on('data',chunk=>{size+=chunk.length;if(size>200*1024||total+size>512*1024){stream.destroy();finish(Error('ZIP条目超出读取上限。'));}else chunks.push(chunk);});stream.on('error',()=>finish(Error('ZIP文本读取失败。')));stream.on('end',()=>{if(done)return;total+=size;const text=decode(Buffer.concat(chunks));if(text?.trim()){files.push({path:e.fileName,text});}zip.readEntry();});});
 });zip.readEntry();
 });});}
export async function inspectProgram(ops,assetIds){
 if(!Array.isArray(assetIds)||assetIds.length<1||assetIds.length>10||assetIds.some(x=>typeof x!=='string'))throw Error('请先传入1～10个程序或代码文件。');
 const sources=[],names=[];let bytes=0;
 for(const id of new Set(assetIds)){const asset=ops.assets.get(id);if(!asset)throw Error('传入文件已不存在，请重新传入。');const info=await stat(asset.diskPath);if(info.size!==asset.size)throw Error('暂存文件已变化，请重新传入。');names.push({name:asset.name,size:asset.size});
  if(/\.zip$/i.test(asset.name)){if(asset.size>32*1024*1024)throw Error('用于AI读取的ZIP不能超过32MiB，请提供精简源码或README。');const data=await zipTexts(await readFile(asset.diskPath));for(const f of data.files){const n=Buffer.byteLength(f.text);if(sources.length>=24||bytes+n>512*1024)break;sources.push({path:asset.name+'/'+f.path,text:f.text});bytes+=n;}}
  else if(readable(path.basename(asset.name))&&asset.size<=200*1024){const text=decode(await readFile(asset.diskPath));if(text?.trim()&&sources.length<24&&bytes+Buffer.byteLength(text)<=512*1024){sources.push({path:asset.name,text});bytes+=Buffer.byteLength(text);}}
 }
 if(!sources.length)throw Error('没有可供AI阅读的源码或说明文件。仅凭exe、msi、apk等安装包无法可靠判断功能，请补充源码ZIP、代码文件或README。');
 // Explicitly bounded model context; archive metadata and binary names are not functional evidence.
 let remaining=28000;const files=sources.map(f=>{const text=f.text.slice(0,Math.min(6000,remaining));remaining-=text.length;return {path:f.path,text};}).filter(f=>f.text);
 return {uploadedFiles:names,files,readFiles:files.map(f=>f.path),notice:'只读取了列出的文本，没有运行程序；不要根据文件名推断未验证功能。'};
}
