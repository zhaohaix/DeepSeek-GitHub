import{randomUUID}from'node:crypto';
import{checkPublic}from'./check-public.mjs';import{mkdir,readFile,writeFile,copyFile}from'node:fs/promises';import{execFileSync}from'node:child_process';import path from'node:path';
const files=await checkPublic(),p=JSON.parse(await readFile('package.json','utf8')),stage=path.join('release','source-'+p.version+'-'+randomUUID().slice(0,8));await mkdir(stage,{recursive:true});
for(const file of files){const target=path.join(stage,file);await mkdir(path.dirname(target),{recursive:true});await copyFile(file,target);}
const archive=path.resolve('release',`dsh-github-connect-${p.version}-source.zip`);const quote=s=>s.replaceAll("'","''");
if(process.platform!=='win32')throw Error('此源码ZIP脚本使用Windows PowerShell；其他系统请按publicFiles白名单打包。');
execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',`Compress-Archive -Path '${quote(path.resolve(stage))}/*' -DestinationPath '${quote(archive)}' -Force`],{windowsHide:true,stdio:'inherit'});
console.log('白名单源码ZIP已生成到release目录。');
