import React,{useState} from 'react';
import {browserSearch} from './browser-query.mjs';
const initial={language:'',minStars:'',license:'',pushed:'',owner:'',ownerType:'user',repo:'',path:'',symbol:'',visibility:'',sort:''};
export function BrowserSearch(){
  const [query,setQuery]=useState(''),[type,setType]=useState('repositories'),[filters,setFilters]=useState(initial),[error,setError]=useState('');
  const set=(key,value)=>{setFilters(old=>({...old,[key]:value}));setError('');};
  let result=null;try{result=browserSearch({query,type,...filters});}catch{}
  const field=(key,label,input)=> <label className="gh-field"><span>{label}</span>{input??<input aria-label={label} value={filters[key]} onChange={e=>set(key,e.target.value)}/>}</label>;
  return <form className="gh-browser-search" aria-label="GitHub 官网搜索" action="https://github.com/search" method="get" target="_blank" rel="noopener noreferrer" onSubmit={e=>{try{browserSearch({query,type,...filters});setError('');}catch(ex){e.preventDefault();setError(ex.message);}}}>
    <input type="hidden" name="q" value={result?.query??''}/><input type="hidden" name="type" value={type}/>{result?.sort&&<><input type="hidden" name="s" value={result.sort}/><input type="hidden" name="o" value="desc"/></>}
    <div className="gh-search-row"><select aria-label="搜索类型" value={type} onChange={e=>{setType(e.target.value);setError('');}}><option value="repositories">仓库</option><option value="code">代码</option></select><input aria-label="搜索 GitHub" value={query} maxLength={2000} onChange={e=>{setQuery(e.target.value);setError('');}} placeholder={type==='code'?'输入代码关键词或 GitHub 搜索语句':'搜索 GitHub 项目或输入搜索条件'}/><button className="gh-primary" type="submit">官网搜索 ↗</button></div>
    <p className="gh-muted">在浏览器打开 GitHub 官网，使用浏览器中登录的账号。</p>
    <details className="gh-search-advanced"><summary>高级筛选</summary><div className="gh-search-fields">
      {field('language','编程语言',<><input aria-label="编程语言" list="gh-search-languages" value={filters.language} onChange={e=>set('language',e.target.value)} placeholder="不限"/><datalist id="gh-search-languages">{['Python','JavaScript','TypeScript','Go','Rust','Java','C++','C#'].map(x=><option key={x} value={x}/>)}</datalist></>)}
      {field('visibility','搜索范围',<select aria-label="搜索范围" value={filters.visibility} onChange={e=>set('visibility',e.target.value)}><option value="">官网默认范围</option><option value="public">仅公开项目</option><option value="private">仅私有项目</option></select>)}
      {field('ownerType','限定类型',<select aria-label="限定类型" value={filters.ownerType} onChange={e=>set('ownerType',e.target.value)}><option value="user">作者</option><option value="org">组织</option></select>)}
      {field('owner','作者或组织名称')}
      {type==='repositories'?<>
        {field('minStars','最低 Star 数',<input aria-label="最低 Star 数" type="number" min="0" step="1" value={filters.minStars} onChange={e=>set('minStars',e.target.value)} placeholder="不限"/>)}
        {field('sort','排序方式',<select aria-label="排序方式" value={filters.sort} onChange={e=>set('sort',e.target.value)}><option value="">相关性</option><option value="stars">Star 最多</option><option value="updated">最近更新</option><option value="forks">Fork 最多</option></select>)}
        {field('license','开源许可证',<select aria-label="开源许可证" value={filters.license} onChange={e=>set('license',e.target.value)}><option value="">不限</option><option value="mit">MIT</option><option value="apache-2.0">Apache 2.0</option><option value="gpl-3.0">GPL 3.0</option><option value="bsd-3-clause">BSD 3-Clause</option><option value="mpl-2.0">MPL 2.0</option><option value="unlicense">Unlicense</option></select>)}
        {field('pushed','最近推送起始日',<input aria-label="最近推送起始日" type="date" value={filters.pushed} onChange={e=>set('pushed',e.target.value)}/>)}
      </>:<>{field('repo','限定仓库（作者/仓库名）')}{field('path','文件路径')}{field('symbol','函数或类名（symbol）')}</>}
    </div><button type="button" className="gh-reset-search" onClick={()=>{setFilters(initial);setError('');}}>清除筛选</button><p className="gh-muted">可直接在搜索框手写 GitHub 高级语法；筛选条件会追加到语句后。代码模式还支持官网的正则与符号搜索。</p></details>
    {result&&<details className="gh-search-preview"><summary>查看搜索语句</summary><code>{result.query}</code></details>}
    {error&&<p className="gh-error" role="alert">{error}</p>}
  </form>;
}
