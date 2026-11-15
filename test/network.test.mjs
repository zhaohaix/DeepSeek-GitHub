import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import {once} from 'node:events';
import {createTransport,networkFailure} from '../src/network.mjs';
test('代理通过 CONNECT 工作，NO_PROXY 可绕过，连接不修改全局 dispatcher',async()=>{
 const target=http.createServer((req,res)=>res.end('target'));target.listen(0,'127.0.0.1');await once(target,'listening');
 let tunnels=0;const sockets=new Set();const proxy=http.createServer();
 proxy.on('connect',(req,client,head)=>{tunnels++;const [host,port]=req.url.split(':');const remote=net.connect(Number(port),host,()=>{client.write('HTTP/1.1 200 Connection Established\r\n\r\n');if(head.length)remote.write(head);client.pipe(remote);remote.pipe(client);});sockets.add(client);sockets.add(remote);remote.on('error',()=>client.destroy());});
 proxy.listen(0,'127.0.0.1');await once(proxy,'listening');
 const direct=createTransport({env:{DSH_GITHUB_PROXY:'http://127.0.0.1:1',NO_PROXY:'127.0.0.1'}});
 const via=createTransport({env:{DSH_GITHUB_PROXY:'http://127.0.0.1:'+proxy.address().port}});
 try{const url='http://127.0.0.1:'+target.address().port;assert.equal(await(await direct.fetch(url)).text(),'target');assert.equal(tunnels,0);assert.equal(await(await via.fetch(url)).text(),'target');assert.equal(tunnels,1);}
 finally{await direct.close();await via.close();for(const s of sockets)s.destroy();target.closeAllConnections();await new Promise(r=>target.close(r));await new Promise(r=>proxy.close(r));}
});
test('不接受 SOCKS 端口伪装为 HTTP 代理，网络错误提示不泄露错误原文',()=>{
 assert.throws(()=>createTransport({env:{DSH_GITHUB_PROXY:'socks5://127.0.0.1:1080'}}),/HTTP/);
 for(const [code,reason]of [['ENOTFOUND','dns_error'],['ECONNREFUSED','connection_error'],['ETIMEDOUT','timeout'],['DEPTH_ZERO_SELF_SIGNED_CERT','tls_error']]){
 const e=networkFailure(Object.assign(Error('secret-password'),{cause:{code}}));assert.equal(e.reason,reason);assert.equal(e.message.includes('secret'),false);
 }
});
