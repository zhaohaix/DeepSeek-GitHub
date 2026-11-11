import React,{useEffect,useRef} from 'react';
export function repositoryDeleteSettings(repo,login){
  if(typeof login!=='string'||typeof repo?.owner!=='string'||repo.owner.toLowerCase()!==login.toLowerCase())return null;
  if(!/^[A-Za-z0-9-]+$/.test(repo.owner)||typeof repo.name!=='string'||! /^(?!\.{1,2}$)[A-Za-z0-9_.-]+$/.test(repo.name))return null;
  return `https://github.com/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}/settings#danger-zone`;
}
export function DeleteRepositoryLink({repo,login,disabled=false}){
  const dialog=useRef(null),url=repositoryDeleteSettings(repo,login);
  useEffect(()=>{dialog.current?.close();},[repo?.full_name,login]);
  if(!url)return null;
  return <><button type="button" className="gh-delete-repo" disabled={disabled} onClick={()=>dialog.current.showModal()}>删除仓库</button>
    <dialog className="gh-delete-dialog" ref={dialog} aria-labelledby="gh-delete-title" aria-describedby="gh-delete-description" onKeyDown={e=>{if(e.key==='Escape')e.stopPropagation();}}>
      <h3 id="gh-delete-title">前往 GitHub 删除仓库？</h3>
      <p className="gh-delete-target">{repo.owner}/{repo.name}</p>
      <p id="gh-delete-description">确认后将在浏览器打开这个仓库的设置页。请在官网找到 Danger Zone（危险区域），核对仓库并按 GitHub 的提示完成删除。</p>
      <p className="gh-muted">删除会影响仓库及相关发布，请先确认是否需要备份。此处确认只会打开网页，仓库不会立即删除。官网使用浏览器中登录的账号。</p>
      <div className="gh-delete-actions"><button type="button" autoFocus onClick={()=>dialog.current.close()}>取消</button><a className="gh-delete-continue" href={url} target="_blank" rel="noopener noreferrer" onClick={()=>dialog.current.close()}>前往官网删除</a></div>
    </dialog>
  </>;
}
