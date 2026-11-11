const qualifier=(key,value)=>`${key}:${/\s/.test(value)?JSON.stringify(value):value}`;
export function browserSearch({query='',type='repositories',language='',minStars='',license='',pushed='',owner='',ownerType='user',repo='',path='',symbol='',visibility='',sort=''}={}){
  if(!['repositories','code'].includes(type))throw Error('请选择仓库或代码搜索。');
  const q=String(query).trim();
  if(q.length>2000||/[\x00-\x1f\x7f]/.test(q))throw Error('搜索语句过长或包含无效字符。');
  const terms=q?[q]:[];
  const value=(v,label)=>{v=String(v).trim();if(v.length>200||/[\x00-\x1f\x7f]/.test(v))throw Error(`${label}格式不正确。`);return v;};
  if(language.trim())terms.push(qualifier('language',value(language,'语言')));
  if(owner.trim()){if(!['user','org'].includes(ownerType)||!/^[a-zA-Z0-9-]{1,100}$/.test(owner.trim()))throw Error('作者或组织名称格式不正确。');terms.push(qualifier(ownerType,owner.trim()));}
  if(visibility){if(!['public','private'].includes(visibility))throw Error('搜索范围无效。');terms.push('is:'+visibility);}
  if(type==='repositories'){
    if(minStars!==''){if(!/^\d+$/.test(String(minStars))||!Number.isSafeInteger(Number(minStars)))throw Error('最低 Star 数需要填写非负整数。');terms.push('stars:>='+Number(minStars));}
    if(license){if(!['mit','apache-2.0','gpl-3.0','bsd-3-clause','mpl-2.0','unlicense'].includes(license))throw Error('许可证选项无效。');terms.push('license:'+license);}
    if(pushed){if(!/^\d{4}-\d{2}-\d{2}$/.test(pushed)||!Number.isFinite(Date.parse(pushed))||new Date(pushed).toISOString().slice(0,10)!==pushed)throw Error('更新起始日期无效。');terms.push('pushed:>='+pushed);}
    if(sort&&!['stars','updated','forks'].includes(sort))throw Error('排序选项无效。');
  }else{
    if(repo.trim()){const r=value(repo,'仓库');if(!/^[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/.test(r))throw Error('限定仓库需填写“作者/仓库名”。');terms.push('repo:'+r);}
    if(path.trim())terms.push(qualifier('path',value(path,'文件路径')));
    if(symbol.trim())terms.push(qualifier('symbol',value(symbol,'符号名称')));
  }
  if(!terms.length)throw Error('请输入关键词或选择至少一个筛选条件。');
  const combined=terms.join(' '),url=new URL('https://github.com/search');url.searchParams.set('q',combined);url.searchParams.set('type',type);
  if(type==='repositories'&&sort){url.searchParams.set('s',sort);url.searchParams.set('o','desc');}
  return {url:url.href,query:combined,type,sort:type==='repositories'?sort:''};
}
