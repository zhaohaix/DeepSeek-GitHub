import {mkdirSync,appendFileSync,statSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const events=new Set(['plugin_started','plugin_stopped','credential_read','credential_saved','logout','oauth_started','oauth_waiting','oauth_failed','api_response','api_failure']);
const categories=new Set(['account','search','repository','upload','authorization']);
const reasons=new Set(['ok','missing','read_failed','decrypt_failed','invalid_local','invalid_credentials','forbidden','rate_limited','server_error','network_error','timeout','authorization_failed','access_denied','expired_token','device_flow_disabled','incorrect_client_credentials','incorrect_device_code','unsupported_grant_type','oauth_error','local_disconnect']);
/** Allowlisted metadata only. Never accept messages, URLs, queries or tokens. */
export function createDiagnostics(root,{now=Date.now}={}){
  const file=path.join(root,'diagnostics.jsonl'),last=new Map();
  return (event,fields={})=>{
    if(!events.has(event))return;
    const data={};if(categories.has(fields.category))data.category=fields.category;if(reasons.has(fields.reason))data.reason=fields.reason;
    if(Number.isInteger(fields.status)&&fields.status>=100&&fields.status<=599)data.status=fields.status;
    if(typeof fields.hasCredential==='boolean')data.hasCredential=fields.hasCredential;
    const key=event+':'+(data.category??''),value=JSON.stringify(data),previous=last.get(key),time=now();
    if(previous?.value===value&&time-previous.time<60000)return;
    last.set(key,{value,time});
    try{mkdirSync(root,{recursive:true});try{if(statSync(file).size>2*1024*1024){const lines=readFileSync(file,'utf8').split('\n');writeFileSync(file,lines.slice(-2000).join('\n')+'\n',{mode:0o600});}}catch{}
      appendFileSync(file,JSON.stringify({time:new Date(time).toISOString(),pid:process.pid,event,...data})+'\n',{mode:0o600});
    }catch{/* Diagnostics failure must not interrupt authentication or API calls. */}
  };
}
export function requestCategory(route){return route==='/user'?'account':route.startsWith('/search/')?'search':route.includes('/assets')?'upload':'repository';}
