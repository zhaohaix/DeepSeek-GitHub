import {access} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const result=spawnSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status??1);
await access('lib/index.js');await access('lib/client.js');
const plugin=await import('../lib/index.js');
if(typeof plugin.apply!=='function')throw Error('Plugin entry unavailable');
console.log('F0: real plugin entry + client artifacts available');
