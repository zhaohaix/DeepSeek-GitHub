import yauzl from 'yauzl';import{readFile,stat}from'node:fs/promises';import path from'node:path';
// 只把有文本证据的源码/说明交给模型；安装包本体不读、不执行。
const MAX_SOURCES=24,MAX_TOTAL=512*1024,MAX_ENTRY=200*1024,MAX_ZIP=32*1024*1024,MAX_ENTRIES=2000;
const textTypes=/\.(md|markdown|txt|py|js|mjs|cjs|ts|tsx|jsx|java|kt|kts|go|rs|c|h|cpp|hpp|cs|swift|rb|php|sh|bash|bat|cmd|ps1|html|htm|css|scss|json|ya?ml|toml|xml|gradle|properties|ini|cfg|conf|vue|svelte|sql|lua|dart|r|pl)$/i;
const blockedDir=/(^|\/)(node_modules|\.git|\.svn|vendor|build|dist|out|target|\.venv|venv|__pycache__|\.next|coverage)\//i;
const blockedFile=/(^|\/)(\.env[^/]*|id_rsa|id_ed25519|credentials[^/]*|\.npmrc|\.netrc|package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/i;
const secret=/(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16})/;
const clean=n=>String(n??'').replace(/\\/g,'/').replace(/^\/+/,'');
const safeName=n=>clean(n).split('/').filter(p=>p&&p!=='.'&&p!=='..').join('/').slice(0,300);
const readable=n=>{const p=safeName(n);return !!p&&textTypes.test(p)&&!blockedDir.test(p.toLowerCase())&&!blockedFile.test(p.toLowerCase());};
// 文本必须能按 UTF-8 或 GBK 严格解码，且不含疑似凭据；否则宁可不读。
const decode=b=>{if(b.includes(0))return null;for(const encoding of ['utf-8','gbk']){try{const text=new TextDecoder(encoding,{fatal:true}).decode(b);return secret.test(text)?null:text;}catch{}}return null;};
function zipTexts(buffer){return new Promise((resolve,reject)=>{
 yauzl.fromBuffer(buffer,{lazyEntries:true,validateEntrySizes:true},(error,zip)=>{
  if(error)return reject(Error('ZIP 无法读取或已损坏，请重新打包为 ZIP。'));
  const files=[],names=[];let total=0,count=0,done=false;
  const finish=failure=>{if(done)return;done=true;try{zip.close();}catch{}failure?reject(failure):resolve({files,names});};
  zip.on('error',error=>finish(/relative path|absolute path|invalid characters/i.test(String(error?.message))?Error('ZIP 内含不安全的文件路径，已拒绝读取。'):Error('ZIP 解压读取失败。')));zip.on('end',()=>finish());zip.on('entry',entry=>{
   if(++count>MAX_ENTRIES)return finish();
   const name=safeName(entry.fileName);if(name&&names.length<120)names.push(name);
   if(files.length>=MAX_SOURCES||total>=MAX_TOTAL)return finish();
   if(!readable(name)||entry.uncompressedSize>MAX_ENTRY||entry.uncompressedSize+total>MAX_TOTAL||(entry.generalPurposeBitFlag&1))return zip.readEntry();
   zip.openReadStream(entry,(err,stream)=>{
    if(err)return finish(Error('ZIP 文本条目无法读取。'));
    let size=0;const chunks=[];
    stream.on('data',chunk=>{size+=chunk.length;if(size>MAX_ENTRY||total+size>MAX_TOTAL){stream.destroy();finish(Error('ZIP 条目超出读取上限，请提供精简源码。'));}else chunks.push(chunk);});
    stream.on('error',()=>finish(Error('ZIP 文本读取失败。')));
    stream.on('end',()=>{if(done)return;const text=decode(Buffer.concat(chunks));if(text?.trim()){total+=size;files.push({path:name,text});}zip.readEntry();});
   });
  });zip.readEntry();
 });
});}
export async function inspectProgram(ops,assetIds){
 if(!Array.isArray(assetIds)||assetIds.length<1||assetIds.length>10||assetIds.some(x=>typeof x!=='string'))throw Error('请先传入 1～10 个程序或代码文件。');
 const uploadedFiles=[],sources=[];let bytes=0;
 for(const id of new Set(assetIds)){
  const asset=ops.assets.get(id);if(!asset)throw Error('传入文件已不存在，请重新传入。');const info=await stat(asset.diskPath);if(info.size!==asset.size)throw Error('暂存文件已变化，请重新传入。');
  uploadedFiles.push({name:asset.name,size:asset.size});
  if(/\.zip$/i.test(asset.name)){
   if(asset.size>MAX_ZIP)throw Error('用于 AI 读取的 ZIP 不能超过 32 MiB，请提供精简源码或 README。');
   for(const file of (await zipTexts(await readFile(asset.diskPath))).files){const size=Buffer.byteLength(file.text);if(sources.length>=MAX_SOURCES||bytes+size>MAX_TOTAL)break;sources.push({path:asset.name+'/'+file.path,text:file.text});bytes+=size;}
  }else if(readable(asset.name)&&asset.size<=MAX_ENTRY){
   const text=decode(await readFile(asset.diskPath));if(text?.trim()&&sources.length<MAX_SOURCES&&bytes+Buffer.byteLength(text)<=MAX_TOTAL){sources.push({path:safeName(asset.name),text});bytes+=Buffer.byteLength(text);}
  }
 }
 if(!sources.length)throw Error('没有可供 AI 阅读的源码或说明文件。仅凭 exe、msi、apk 等安装包无法可靠判断功能，请补充源码 ZIP、代码文件或 README。');
 // Explicitly bounded model context; archive metadata and binary names are not functional evidence.
 let remaining=28000;const files=sources.map(f=>{const text=f.text.slice(0,Math.min(6000,remaining));remaining-=text.length;return {path:f.path,text};}).filter(f=>f.text);
 return {uploadedFiles,files,readFiles:files.map(f=>f.path),notice:'只读取了列出的文本，没有运行程序；不要根据文件名推断未验证功能。'};
}
