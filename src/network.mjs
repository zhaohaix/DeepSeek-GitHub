import tls from 'node:tls';
import {EnvHttpProxyAgent,fetch as undiciFetch} from 'undici';

const messages={
 tls_error:'GitHub HTTPS 证书校验失败。请检查加速器证书是否已正确安装到 Windows 信任证书库，或暂时关闭 GitHub 加速。',
 dns_error:'无法解析 GitHub 地址，请检查 DNS 或加速器的域名接管。',
 timeout:'连接 GitHub 超时，请检查网络或代理线路。',
 connection_error:'GitHub 连接中断或代理端口不可用，请检查加速器和代理设置。',
 network_error:'无法连接 GitHub，请检查网络与代理设置。'
};
export function networkFailure(error){
 if(error?.reason&&messages[error.reason])return error;
 const errors=[error,error?.cause,...(error?.cause?.errors??[])];
 const codes=errors.map(e=>e?.code??e?.name??'');
 const reason=codes.some(c=>/CERT|SELF_SIGNED|TLS|SSL/.test(c))?'tls_error':
   codes.some(c=>/ENOTFOUND|EAI_AGAIN/.test(c))?'dns_error':
   codes.some(c=>/TIMEOUT|TimeoutError|ETIMEDOUT/.test(c))?'timeout':
   codes.some(c=>/ECONN|EHOST|ENET|UND_ERR_SOCKET/.test(c))?'connection_error':'network_error';
 return Object.assign(Error(messages[reason]),{reason,retryable:reason!=='tls_error',cause:error});
}
export function createTransport({env=process.env,fetchImpl=undiciFetch}={}){
 const ca=[...new Set([...(tls.getCACertificates?.('default')??tls.rootCertificates),...(tls.getCACertificates?.('system')??[])])];
 const explicit=env.DSH_GITHUB_PROXY;
 const httpProxy=explicit??env.http_proxy??env.HTTP_PROXY??'';
 const httpsProxy=explicit??env.https_proxy??env.HTTPS_PROXY??httpProxy;
 for(const address of [httpProxy,httpsProxy])if(address){let url;try{url=new URL(address);}catch{throw Error('GitHub 代理地址无效，请设置 HTTP 或 HTTPS 代理地址。');}if(!['http:','https:'].includes(url.protocol))throw Error('GitHub 代理目前仅支持 HTTP/HTTPS；请使用加速器的 HTTP 代理端口。');}
 const dispatcher=new EnvHttpProxyAgent({httpProxy,httpsProxy,noProxy:env.no_proxy??env.NO_PROXY??'',connect:{ca,autoSelectFamily:true},requestTls:{ca},proxyTls:{ca}});
 return {
  async fetch(url,options){try{return await fetchImpl(url,{...options,dispatcher});}catch(e){if(options?.signal?.aborted&&options.signal.reason?.name==='AbortError')throw options.signal.reason;throw networkFailure(e);}},
  close:()=>dispatcher.destroy()
 };
}
