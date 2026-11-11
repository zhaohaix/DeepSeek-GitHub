import React,{useState,useRef,useEffect}from'react';import{RepositoryNameField}from'./repository-name-field.jsx';
const MAX_FILES=10,MAX_READ=32*1024*1024;
export function NewRepositoryForm({upload,apiCall,onPrepare,busy=false}){
 const [files,setFiles]=useState([]),[description,setDescription]=useState(''),[working,setWorking]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState(''),[saved,setSaved]=useState(''),[readFiles,setReadFiles]=useState([]),[model,setModel]=useState(''),[autosaved,setAutosaved]=useState('');
 const picker=useRef(null),locked=busy||!!working,firstRender=useRef(true);
 useEffect(()=>{let live=true;apiCall('draft/get',{kind:'repository'}).then(r=>{if(live&&typeof r?.description==='string'&&r.description)setDescription(old=>old||r.description);}).catch(()=>{});return()=>{live=false;};},[]);
 useEffect(()=>{if(firstRender.current){firstRender.current=false;return;}const t=setTimeout(()=>{const save=description.trim()?apiCall('draft/save',{kind:'repository',description}):apiCall('draft/clear',{kind:'repository'});save.then(r=>setAutosaved(r?.savedAt??'')).catch(()=>{});},700);return()=>clearTimeout(t);},[description]);
 const remove=async id=>{setWorking('remove');setError('');try{await apiCall('attachment/remove',{id});setFiles(old=>old.filter(x=>x.id!==id));}catch(ex){setError(ex.message);}finally{setWorking('');}};
 const ingest=async e=>{const chosen=[...e.target.files];e.target.value='';if(!chosen.length)return;
  const names=new Set(files.map(x=>x.name)),accepted=[],skipped=[];
  for(const f of chosen){const base=f.name;
   if(names.has(base)){skipped.push(`${base} 已传入，请先取消旧的再重新传入`);continue;}
   if(f.size>MAX_READ){skipped.push(`${base} 超过 32 MiB，请只汇总精简的源码或说明`);continue;}
   names.add(base);accepted.push(f);}
  if(!accepted.length){setError(skipped.join('；'));return;}
  if(names.size>MAX_FILES){setError(`一次最多传入 ${MAX_FILES} 个文件。`);return;}
  setWorking('upload');setError('');setNotice('');
  try{for(const f of accepted){const result=await upload(f);if(!result?.id)throw Error('文件暂存失败，请重试。');setFiles(old=>[...old.filter(x=>x.name!==result.name),result]);}}
  catch(ex){setError(ex.message);}finally{setWorking('');}
  if(skipped.length)setNotice(skipped.join('；'));};
 const generate=async e=>{setWorking('ai');setError('');setNotice('');const form=e.currentTarget.form,repoName=new FormData(form).get('name');
  try{const r=await apiCall('ai/program',{assetIds:files.map(f=>f.id),repoName,existingDescription:description});setDescription(r.text);setSaved(r.draftPath??'');setReadFiles(r.readFiles??[]);setModel(r.model??'');}
  catch(ex){setError(ex.message);}finally{setWorking('');}};
 const hint=!files.length?'先传入代码、README 或含源码的 ZIP，按钮才会亮起':working==='ai'?'正在读取源码并撰写介绍…':'读取已传入的源码与说明，生成仓库介绍';
 return <form className="gh-form" aria-label="新建仓库" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);onPrepare({name:f.get('name'),description,private:f.get('private')==='on'});}}>
  <RepositoryNameField action={<button type="button" disabled={locked} onClick={()=>picker.current.click()}>{working==='upload'?'传入中…':'传入程序/代码'}</button>}/><input ref={picker} type="file" multiple aria-label="传入程序或代码文件" style={{display:'none'}} onChange={ingest}/>
  {files.length>0&&<div className="gh-imported-files">{files.map(f=><div className="gh-attachment" key={f.id}><div><strong>{f.name}</strong><small>{Math.max(1,Math.round(f.size/1024))} KB</small></div><button type="button" disabled={locked} onClick={()=>remove(f.id)}>{working==='remove'?'移除中…':'取消选用'}</button></div>)}</div>}
  <p className="gh-muted">先传入代码、README 或包含源码的 ZIP，AI 会读取其中的文本再写介绍。文件只暂存本机用于阅读，不会执行，也不会出现在「程序发布」的待发布附件里。</p>
  <div className="gh-field"><div className="gh-ai-label"><label htmlFor="gh-new-repo-description">介绍</label><button type="button" disabled={!files.length||locked} aria-disabled={!files.length||locked} title={hint} onClick={generate}>{working==='ai'?'读取并生成中…':'AI 自动介绍'}</button></div><textarea id="gh-new-repo-description" name="description" rows={3} maxLength={350} value={description} disabled={locked} onChange={e=>setDescription(e.target.value)} placeholder="这个项目用来做什么"/><small className="gh-muted">{files.length?'介绍会依据已传入文件的实际内容生成，生成后可继续手动修改。':'传入程序或代码文件后才能使用 AI 自动介绍。'}</small></div>
  {readFiles.length>0&&<details className="gh-muted"><summary>已读取 {readFiles.length} 个源码或说明文件（只读文本，未运行程序）</summary><ul>{readFiles.map(n=><li key={n}>{n}</li>)}</ul></details>}
  {error&&<p className="gh-error" role="alert">{error}</p>}{notice&&<p className="gh-muted" role="status">{notice}</p>}{saved&&<p className="gh-muted">介绍草稿已保存至 GitHub 工作区：{saved}{model&&`（模型：${model}）`}</p>}{autosaved&&<p className="gh-muted" role="status">介绍已自动保存到 GitHub 工作区 · {new Date(autosaved).toLocaleTimeString('zh-CN',{hour12:false})}</p>}
  <label className="gh-check"><input type="checkbox" name="private"/>创建为私有仓库（默认公开）</label><button className="gh-primary" disabled={locked}>预览创建</button>
 </form>;
}
