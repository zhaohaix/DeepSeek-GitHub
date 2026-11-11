// 纯 JS 生成 ZIP，测试不依赖 PowerShell 的 Compress-Archive。
import {deflateRawSync} from 'node:zlib';
const table=(()=>{const t=new Int32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c;}return t;})();
const crc32=b=>{let c=-1;for(const byte of b)c=table[(c^byte)&255]^(c>>>8);return (c^-1)>>>0;};
export function makeZip(files,{encrypted=false,compress=false}={}){
 const locals=[],central=[];let offset=0;
 for(const file of files){
  const name=Buffer.from(file.name,'utf8'),raw=Buffer.from(file.data??'');
  const packed=compress?deflateRawSync(raw):raw;const body=encrypted?Buffer.concat([Buffer.alloc(12,7),packed]):packed,method=compress?8:0,flags=(encrypted?1:0)|0x0800,crc=crc32(raw);
  const header=Buffer.alloc(30);header.writeUInt32LE(0x04034b50,0);header.writeUInt16LE(20,4);header.writeUInt16LE(flags,6);header.writeUInt16LE(method,8);header.writeUInt16LE(0,10);header.writeUInt16LE(0x21,12);
  header.writeUInt32LE(crc,14);header.writeUInt32LE(body.length,18);header.writeUInt32LE(raw.length,22);header.writeUInt16LE(name.length,26);header.writeUInt16LE(0,28);
  locals.push(header,name,body);
  const cd=Buffer.alloc(46);cd.writeUInt32LE(0x02014b50,0);cd.writeUInt16LE(20,4);cd.writeUInt16LE(20,6);cd.writeUInt16LE(flags,8);cd.writeUInt16LE(method,10);cd.writeUInt16LE(0,12);cd.writeUInt16LE(0x21,14);
  cd.writeUInt32LE(crc,16);cd.writeUInt32LE(body.length,20);cd.writeUInt32LE(raw.length,24);cd.writeUInt16LE(name.length,28);cd.writeUInt16LE(0,30);cd.writeUInt16LE(0,32);cd.writeUInt16LE(0,34);cd.writeUInt16LE(0,36);cd.writeUInt32LE(0,38);cd.writeUInt32LE(offset,42);
  central.push(cd,name);offset+=header.length+name.length+body.length;
 }
 const directory=Buffer.concat(central),count=files.length;
 const end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(0,4);end.writeUInt16LE(0,6);end.writeUInt16LE(count,8);end.writeUInt16LE(count,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);end.writeUInt16LE(0,20);
 return Buffer.concat([...locals,directory,end]);
}
