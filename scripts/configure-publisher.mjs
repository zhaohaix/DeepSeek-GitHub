import {writeFile} from 'node:fs/promises';
const clientId=process.argv[2];if(!/^[A-Za-z0-9_.-]{5,120}$/.test(clientId??''))throw Error('请传入公开的 OAuth App Client ID，不要填写 Client Secret');
await writeFile(new URL('../src/publisher.json',import.meta.url),JSON.stringify({clientId},null,2));console.log('已写入本机开发用 Client ID。公开打包要求预置ID为空，请勿将个人配置作为开源文件提交。');
