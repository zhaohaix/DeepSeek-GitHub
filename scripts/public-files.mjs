import{readdir}from'node:fs/promises';import path from'node:path';
export const publicScripts=['build.mjs','smoke.mjs','verify.mjs','public-files.mjs','check-public.mjs','release-source.mjs','configure-publisher.mjs','install-desktop.ps1','verify-refresh.mjs','verify-browser-search.mjs','verify-delete-link.mjs','verify-program-introduction.mjs','verify-release-editor.mjs','verify-state-drafts.mjs'];
export async function publicFiles(){const list=['package.json','package-lock.json','README.md','LICENSE','OPEN_SOURCE_AUDIT.md','cordis.patch.yml','.gitignore','.npmignore','开始使用.md','安装到桌面端.cmd'];
 for(const dir of ['src','lib','test','docs']){const walk=async p=>{for(const e of await readdir(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isSymbolicLink())throw Error('Public source must not contain symlinks');if(e.isDirectory())await walk(f);else list.push(f);}};await walk(dir);}
 for(const name of publicScripts)list.push(path.join('scripts',name));return list;
}
