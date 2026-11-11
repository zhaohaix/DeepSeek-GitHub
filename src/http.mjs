import {randomUUID} from 'node:crypto';
import {createWriteStream} from 'node:fs';
import {unlink} from 'node:fs/promises';
import {pipeline} from 'node:stream/promises';
import {Transform} from 'node:stream';
import path from 'node:path';

export const API='/dsh-github/api/';
const ROUTES={state:'GET',repos:'GET',contents:'GET',releases:'GET','auth/start':'POST','auth/configure':'POST','auth/logout':'POST',prepare:'POST',confirm:'POST',reject:'POST',upload:'POST','attachment/remove':'POST','ai/copy':'POST','ai/program':'POST'};
const json=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
async function body(req){let size=0;const parts=[];for await(const b of req){size+=b.length;if(size>3*1024*1024)throw Error('请求内容过大。');parts.push(b);}return JSON.parse(Buffer.concat(parts).toString('utf8')||'{}');}
export function admitted(req,connection){
  if(!connection||typeof connection.admit!=='function'||!connection.browserPeer)return false;
  try{if(connection.admit(req).peer!==connection.browserPeer)return false;}catch{return false;}
  const remote=req.socket?.remoteAddress;if(remote&&!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote))return false;
  const origin=req.headers.origin;if(origin&&origin!=='null'){try{if(new URL(origin).host!==req.headers.host)return false;}catch{return false;}}
  if(req.headers['sec-fetch-site']==='cross-site')return false;
  return true;
}
export function routes({api,ops,auth,root,connection,releaseCopy}){
  return Object.entries(ROUTES).map(([name,method])=>({kind:'exact',path:API+name,handler:async(req,res)=>{
    if(!admitted(req,connection()))return json(res,403,{error:'需要本机已认证的 DeepSeek Harness 页面。'});
    if(req.method!==method)return json(res,405,{error:'请求方法不正确。'});
    try{const url=new URL(req.url,'http://localhost');const q=Object.fromEntries(url.searchParams);let result;
      if(name==='state'){let user=null,error=null,errorKind=null;try{user=await api.me();}catch(e){error=e.message;errorKind=!e.status?'network':e.status===401?'auth':e.status===403||e.status===429?'rate-limit':e.status>=500?'server':'other';}result={user,error,errorKind,clientId:await auth.clientId(),hasCredential:await auth.hasCredential(),login:auth.login,operations:ops.list(),attachments:ops.assetList()};}
      else if(name==='repos')result=await api.repos(q.page??1);
      else if(name==='contents')result=await api.contents(q);
      else if(name==='releases')result=await api.releaseList(q);
      else if(name==='upload'){
        const raw=req.headers['x-file-name'];if(typeof raw!=='string')throw Error('缺少附件名称。');const fileName=decodeURIComponent(raw);const id=randomUUID(),disk=path.join(root,'attachments',id);let size=0;
        const limit=new Transform({transform(chunk,encoding,done){size+=chunk.length;if(size>=2*1024**3)done(Error('附件必须小于 2 GiB。'));else done(null,chunk);}});
        try{await pipeline(req,limit,createWriteStream(disk,{flags:'wx',mode:0o600}));result=await ops.addAsset(fileName,disk,id);}catch(e){await unlink(disk).catch(()=>{});throw e;}
      }else{const a=await body(req);
        if(name==='ai/program'){if(!releaseCopy)throw Error('AI介绍服务未就绪。');result=await releaseCopy.describeProgram(a);}
        else if(name==='ai/copy'){if(!releaseCopy)throw Error('AI文案服务尚未就绪。');result=await releaseCopy.create(a);}
        else if(name==='auth/start')result=await auth.start();
        else if(name==='auth/configure'){await auth.configure(a.clientId);result={ok:true};}
        else if(name==='auth/logout'){await auth.logout();ops.clearPending();result={ok:true};}
        else if(name==='prepare')result=await ops.prepare(a.kind,a.args);
        else if(name==='confirm')result=await ops.confirm(a.id);
        else if(name==='reject')result=ops.reject(a.id);
        else if(name==='attachment/remove'){await ops.removeAsset(a.id);result={ok:true};}
      }
      json(res,200,result);
    }catch(e){if(!res.destroyed&&!res.writableEnded)json(res,e.status??400,{error:e.message});}
  }}));
}
