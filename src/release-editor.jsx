import React,{useState,useRef,useEffect} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
function CodePreview({children}){
 const [copied,setCopied]=useState(false),[error,setError]=useState('');
 const text=React.isValidElement(children)?String(children.props.children??''):String(children??'');
 return <div className="gh-copy-code"><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(text);setCopied(true);setError('');}catch{setError('复制失败，请手动选中代码复制。');}}}>{copied?'已复制':'复制代码'}</button><pre>{children}</pre>{error&&<small role="status">{error}</small>}</div>;
}
export function ReleaseEditor({repo,apiCall,onBusyChange}){
 const [title,setTitle]=useState(''),[body,setBody]=useState(''),[busy,setBusy]=useState(''),[error,setError]=useState(''),[saved,setSaved]=useState(''),[preview,setPreview]=useState(false),[imageOpen,setImageOpen]=useState(false),[imageUrl,setImageUrl]=useState(''),[suggestion,setSuggestion]=useState(null);
 const textArea=useRef(null),alive=useRef(true);useEffect(()=>{alive.current=true;return()=>{alive.current=false;onBusyChange?.(false);};},[onBusyChange]);
 const generate=async(e,kind)=>{const form=e.currentTarget.form,f=new FormData(form),tag=f.get('tag')??'',branch=f.get('branch')??'';setBusy(kind);onBusyChange?.(true);setError('');
  try{const r=await apiCall('ai/copy',{owner:repo.owner,repo:repo.name,kind,tag,branch,title,body});if(!alive.current)return;const latest=new FormData(form);if(latest.get('tag')!==tag||latest.get('branch')!==branch){setSuggestion({kind,text:r.text});setError('生成期间版本或分支发生变化，请核对后应用生成结果。');}else if(kind==='title')setTitle(r.text);else setBody(r.text);setSaved(r.draftPath);}
  catch(ex){if(alive.current)setError(ex.message);}finally{if(alive.current){setBusy('');onBusyChange?.(false);}}
 };
 const insert=text=>{if(busy)return;const el=textArea.current,start=el?.selectionStart??body.length,end=el?.selectionEnd??start;setBody(old=>old.slice(0,start)+text+old.slice(end));setPreview(false);};
 return <>
  <div className="gh-field"><div className="gh-ai-label"><label htmlFor="gh-release-title">版本标题</label><button type="button" disabled={!!busy} onClick={e=>generate(e,'title')}>{busy==='title'?'生成中…':'AI 自动生成标题'}</button></div><input id="gh-release-title" name="title" value={title} disabled={!!busy} onChange={e=>setTitle(e.target.value)} placeholder="首个正式版本"/></div>
  <div className="gh-field"><div className="gh-ai-label"><label htmlFor="gh-release-body">更新说明</label><button type="button" disabled={!!busy} onClick={e=>generate(e,'body')}>{busy==='body'?'生成中…':'AI 自动生成介绍'}</button></div>
   <div className="gh-markdown-toolbar"><button type="button" disabled={!!busy} onClick={()=>insert('\n```bash\n# 在这里填写命令或代码\n```\n')}>插入代码块</button><button type="button" disabled={!!busy} onClick={()=>setImageOpen(!imageOpen)}>插入图片链接</button><button type="button" onClick={()=>setPreview(!preview)}>{preview?'返回编辑':'预览 Markdown'}</button></div>
   {imageOpen&&<div className="gh-image-insert"><input aria-label="图片 HTTPS 链接" type="url" disabled={!!busy} value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="https://…/screenshot.png"/><button type="button" disabled={!!busy} onClick={()=>{try{const u=new URL(imageUrl);if(u.protocol!=='https:')throw Error();insert('\n![截图](<'+u.href+'>)\n');setImageUrl('');setImageOpen(false);setError('');}catch{setError('请填写可访问的 HTTPS 图片链接。本地图片需先上传到仓库或其他托管位置。');}}}>插入</button></div>}
   <textarea ref={textArea} id="gh-release-body" name="body" rows={7} value={body} disabled={!!busy} onChange={e=>setBody(e.target.value)} placeholder="介绍这个版本的新增功能和修复内容，支持 Markdown 图片及代码块" style={preview?{display:'none'}:undefined}/>
   {preview&&<div className="gh-markdown-preview"><Markdown remarkPlugins={[remarkGfm]} skipHtml components={{pre:CodePreview,img:({src,alt})=>src?.startsWith('https://')?<img src={src} alt={alt??''} loading="lazy" referrerPolicy="no-referrer"/>:<span>图片需要 HTTPS 链接</span>,a:({href,children})=><a href={href} target="_blank" rel="noopener noreferrer">{children}</a>}}>{body||'暂无内容'}</Markdown></div>}
  </div>
  <p className="gh-muted">AI 使用 Harness 默认模型，根据仓库 README、近期提交和当前草稿生成，会产生模型调用用量。生成结果可编辑，确认后才发布。</p>
  {error&&<p className="gh-error" role="alert">{error}</p>}
  {suggestion&&<div><p>生成建议：{suggestion.text}</p><button type="button" onClick={()=>{suggestion.kind==='title'?setTitle(suggestion.text):setBody(suggestion.text);setSuggestion(null);}}>应用生成结果</button></div>}
  {saved&&<p className="gh-muted">草稿已保存到 GitHub 工作区：{saved}</p>}
 </>;
}
