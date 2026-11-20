import {setTimeout as delay} from 'node:timers/promises';
import {networkFailure} from './network.mjs';
import {credentialStore as platformCredentialStore} from './credential-store.mjs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
export {command,windowsSeal} from './credential-store.mjs';

export class GhAuth{
 constructor(root,{fetchImpl=fetch,seal,credentialStore=platformCredentialStore(root,seal),sleep=(ms,signal)=>delay(ms,undefined,{signal}),diagnostics=()=>{},now=Date.now}={}){
  Object.assign(this,{root,fetch:fetchImpl,credentialStore,sleep,diagnostics,now});this.login={state:'idle'};this.epoch=0;
 }
 async clientId(){try{return JSON.parse(await readFile(path.join(this.root,'oauth.json'),'utf8')).clientId;}catch{if(process.env.DSH_GITHUB_CLIENT_ID)return process.env.DSH_GITHUB_CLIENT_ID;try{return JSON.parse(await readFile(new URL('./publisher.json',import.meta.url),'utf8')).clientId??'';}catch{return '';}}}
 async configure(clientId){if(!/^[A-Za-z0-9_.-]{5,120}$/.test(clientId))throw Error('请输入有效的 OAuth App Client ID。');if(['preparing','waiting'].includes(this.login.state))throw Error('请先完成或取消当前登录。');await mkdir(this.root,{recursive:true});await writeFile(path.join(this.root,'oauth.json'),JSON.stringify({clientId}));}
 async hasCredential(){try{return await this.credentialStore.exists();}catch{return false;}}
 async credential(){
  let plain;
  try { plain = await this.credentialStore.read(); }
  catch (error) {
   this.diagnostics('credential_read',{reason:error.reason??'read_failed',hasCredential:error.hasCredential});
   throw error.status ? error : Object.assign(Error('无法读取本机 GitHub 凭据。'),{status:503});
  }
  if(plain===null){
   this.diagnostics('credential_read',{reason:'missing',hasCredential:false});
   throw Object.assign(Error('请先在设置 → GitHub 中登录。'),{status:401});
  }
  if(typeof plain!=='string'||!plain.trim()){this.diagnostics('credential_read',{reason:'invalid_local',hasCredential:true});throw Object.assign(Error('本机 GitHub 凭据为空，请重新连接。'),{status:401});}
  let data;if(plain.startsWith('{')){try{data=JSON.parse(plain);}catch{throw Object.assign(Error('本机 GitHub 凭据损坏，请重新连接。'),{status:401});}}else data={access_token:plain};
  if(typeof data?.access_token!=='string'||!data.access_token.trim())throw Object.assign(Error('本机 GitHub 凭据无效，请重新连接。'),{status:401});
  this.diagnostics('credential_read',{reason:'ok',hasCredential:true});return data;
 }
 async save(r,epoch,clientId){
  if(typeof r.access_token!=='string'||!r.access_token.trim())throw Error('GitHub 未返回有效凭据，请重新授权。');
  const data={access_token:r.access_token,clientId,...(typeof r.refresh_token==='string'?{refresh_token:r.refresh_token}:{}),
   ...(Number(r.expires_in)>0?{expiresAt:this.now()+Number(r.expires_in)*1000}:{}),
   ...(Number(r.refresh_token_expires_in)>0?{refreshExpiresAt:this.now()+Number(r.refresh_token_expires_in)*1000}:{})};
  const checkCurrent = ()=>{
   if(epoch!==this.epoch)throw new DOMException('登录已取消。','AbortError');
  };
  await this.mutate(async()=>{
   checkCurrent();
   await this.credentialStore.write(JSON.stringify(data),checkCurrent);
  });
  this.diagnostics('credential_saved',{reason:'ok',hasCredential:true});return data.access_token;
 }
 async token(){const d=await this.credential();if(!['preparing','waiting'].includes(this.login.state)&&d.refresh_token&&d.expiresAt&&this.now()>=d.expiresAt-60000)return this.refresh(d);return d.access_token;}
 async refreshAfter401(rejected){if(['preparing','waiting'].includes(this.login.state))return null;const d=await this.credential();if(d.access_token!==rejected)return d.access_token;if(!d.refresh_token)return null;return this.refresh(d);}
 async refresh(d){
  if(this.refreshing)return this.refreshing;
  const epoch=this.epoch,signal=this.refreshController=new AbortController();
  this.refreshing=(async()=>{if(d.refreshExpiresAt&&this.now()>=d.refreshExpiresAt)throw Object.assign(Error('GitHub 续期凭据已过期，请重新登录。'),{status:401});
   // Rotation can succeed before a response is lost. Never blindly replay refresh requests.
   const r=await this.request('https://github.com/login/oauth/access_token',{client_id:d.clientId??await this.clientId(),grant_type:'refresh_token',refresh_token:d.refresh_token},{signal:signal.signal,attempts:1});
   if(r.error||!r.refresh_token)throw Object.assign(Error('GitHub 登录已失效或续期响应不完整，请重新授权。'),{status:401});
   return this.save(r,epoch,d.clientId??await this.clientId());
  })();try{return await this.refreshing;}finally{this.refreshing=null;this.refreshController=null;}
 }
 async request(url,fields,{signal,attempts=3,deadline=Infinity,onRetry=()=>{}}={}){
  for(let attempt=0;;attempt++){
   signal?.throwIfAborted();const remaining=deadline-this.now();if(remaining<=0)throw Object.assign(Error('设备授权已过期，请重新登录。'),{reason:'expired_token'});
   try{
    const timeout=AbortSignal.timeout(Math.max(1,Math.min(30000,Math.ceil(remaining))));
    const r=await this.fetch(url,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(fields),signal:signal?AbortSignal.any([signal,timeout]):timeout,redirect:'error'});
    if(!r.ok){await r.body?.cancel();throw Object.assign(Error('GitHub 授权服务暂时不可用（'+r.status+'）。'),{status:r.status,retryable:r.status===429||r.status>=500,retryAfter:Number(r.headers.get('retry-after'))||0,reason:'server_error'});}
    try{return await r.json();}catch{throw Object.assign(Error('GitHub 返回的授权数据不完整，请检查加速线路。'),{retryable:true,reason:'network_error'});}
   }catch(error){
    if(signal?.aborted)throw signal.reason;
    const e=error.reason||error.status?error:networkFailure(error);
    if(!e.retryable||attempt+1>=attempts)throw e;
    const wait=Math.max(1000*2**Math.min(attempt,4),(e.retryAfter??0)*1000);
    if(this.now()+wait>=deadline)throw Object.assign(Error('设备授权已过期，请重新登录。'),{reason:'expired_token'});
    onRetry(e);await this.sleep(wait,signal);
   }
  }
 }
 async start(){
  if(['preparing','waiting'].includes(this.login.state))return this.login;
  const epoch=++this.epoch,controller=this.controller=new AbortController(),signal=controller.signal;
  this.refreshController?.abort();this.login={state:'preparing'};let clientId;
  try{clientId=await this.clientId();if(!clientId)throw Error('请先配置 GitHub OAuth App Client ID，并启用 Device Flow。');}
  catch(e){this.login={state:'error',message:e.message};throw e;}
  if(epoch!==this.epoch)return this.login;
  this.diagnostics('oauth_started',{category:'authorization'});
  this.task=(async()=>{try{
   const notify=e=>{if(epoch===this.epoch){this.login={...this.login,message:e.message+' 正在自动重试…'};this.diagnostics('oauth_retry',{category:'authorization',reason:e.reason});}};
   const d=await this.request('https://github.com/login/device/code',{client_id:clientId,scope:'repo offline_access'},{signal,onRetry:notify});
   if(d.error||!d.device_code||!d.user_code)throw Object.assign(Error('无法开始 GitHub 授权，请检查 Client ID 及 Device Flow 配置。'),{reason:d.error});
   signal.throwIfAborted();this.login={state:'waiting',code:d.user_code,url:'https://github.com/login/device'};
   this.diagnostics('oauth_waiting',{category:'authorization'});
   let interval=Math.max(5,Number(d.interval)||5),failures=0;const deadline=this.now()+Math.min(900,Number(d.expires_in)||900)*1000;
   while(this.now()<deadline){
    const wait=Math.max(interval,Math.min(60,interval*2**Math.min(failures,4)))*1000;
    if(this.now()+wait>=deadline)break;await this.sleep(wait,signal);signal.throwIfAborted();if(this.now()>=deadline)break;
    let r;try{r=await this.request('https://github.com/login/oauth/access_token',{client_id:clientId,device_code:d.device_code,grant_type:'urn:ietf:params:oauth:grant-type:device_code'},{signal,attempts:1,deadline});}
    catch(e){if(signal.aborted||!e.retryable)throw e;failures++;interval=Math.max(interval,e.retryAfter??0);notify(e);continue;}
    failures=0;this.login={...this.login,message:undefined};
    if(r.access_token){await this.save(r,epoch,clientId);signal.throwIfAborted();this.login={state:'complete'};return;}
    if(r.error==='authorization_pending')continue;
    if(r.error==='slow_down'){interval=Math.max(interval+5,Number(r.interval)||0);continue;}
    throw Object.assign(Error(r.error==='access_denied'?'你已取消 GitHub 授权。':'GitHub 授权已过期或被拒绝，请重新登录。'),{reason:r.error});
   }
   throw Object.assign(Error('设备授权已过期，请重新登录。'),{reason:'expired_token'});
  }catch(e){if(epoch!==this.epoch)return;this.diagnostics('oauth_failed',{category:'authorization',reason:e.reason??'authorization_failed'});this.login={state:'error',message:e.message};}})();return this.login;
 }
 cancel(){++this.epoch;this.controller?.abort();this.refreshController?.abort();this.login={state:'idle'};}
 mutate(fn){const task=(this.mutation??Promise.resolve()).catch(()=>{}).then(fn);this.mutation=task;return task;}
 async logout(){this.cancel();await this.mutate(()=>this.credentialStore.remove());this.diagnostics('logout',{reason:'local_disconnect',hasCredential:false});}
 dispose(){this.cancel();}
}
