import {mkdir,readFile,writeFile,rename,unlink} from 'node:fs/promises';
import path from 'node:path';
// 草稿自动保存到 GitHub 工作区；不暴露新按钮，只由表单在输入后与切换时调用。
const clean=s=>String(s??'').replace(/[^a-zA-Z0-9_.-]/g,'_').replace(/^[._]+/,'').slice(0,60)||'untitled';
const text=(s,label,max)=>{s=s??'';if(typeof s!=='string'||s.length>max)throw Error(`${label}必须是文本，且不超过 ${max} 字符。`);return s;};
export class Drafts{
 constructor({root,now=Date.now}={}){this.dir=path.join(root,'workspace','drafts');this.now=now;}
 key(a){const kind=a?.kind;
  if(kind==='repository')return{id:'new-repository',label:'新建仓库'};
  if(kind==='release'){if(typeof a.owner!=='string'||!a.owner.trim()||typeof a.repo!=='string'||!a.repo.trim())throw Error('缺少仓库信息。');return{id:`${clean(a.owner)}/${clean(a.repo)}`,label:`${a.owner}/${a.repo}`};}
  throw Error('草稿类型无效。');}
 file(k){return path.join(this.dir,...k.id.split('/'));}
 normalize(a){return a.kind==='release'?{kind:'release',owner:String(a.owner??'').slice(0,100),repo:String(a.repo??'').slice(0,100),title:text(a.title,'版本标题',200),body:text(a.body,'更新说明',50000)}:{kind:'repository',description:text(a.description,'介绍',350)};}
 markdown(k,d){return d.kind==='release'?`# ${k.label} 发布文案草稿\n\n更新时间：${d.updatedAt}\n\n## 版本标题\n\n${d.title||'（未填写）'}\n\n## 更新说明\n\n${d.body||'（未填写）'}\n`:`# 新建仓库草稿\n\n更新时间：${d.updatedAt}\n\n## 介绍\n\n${d.description||'（未填写）'}\n`;}
 async save(a){const key=this.key(a),data={...this.normalize(a),updatedAt:new Date(this.now()).toISOString()};await mkdir(this.dir,{recursive:true});const base=this.file(key);await mkdir(path.dirname(base),{recursive:true});
  await writeFile(base+'.json.tmp',JSON.stringify(data,null,2),{mode:0o600});await rename(base+'.json.tmp',base+'.json');await writeFile(base+'.md',this.markdown(key,data),{mode:0o600});
  return{savedAt:data.updatedAt,label:key.label};}
 async load(a){try{const data=JSON.parse(await readFile(this.file(this.key(a))+'.json','utf8'));return typeof data==='object'&&data?data:null;}catch{return null;}}
 async clear(a){const base=this.file(this.key(a));await Promise.all([unlink(base+'.json').catch(()=>{}),unlink(base+'.md').catch(()=>{})]);return{ok:true};}
}
