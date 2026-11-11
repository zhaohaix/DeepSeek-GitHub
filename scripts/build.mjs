import {build} from 'esbuild';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('lib',{recursive:true});
await copyFile('src/publisher.json','lib/publisher.json');
for(const file of ['index','core','gh','http','tools','search','diagnostics','release-copy','repository-name','program-inspect','drafts'])await copyFile(`src/${file}.mjs`,`lib/${file}.js`);
// Keep source module extensions for the Node entry's relative imports.
for(const file of ['core','gh','http','tools','search','diagnostics','release-copy','repository-name','program-inspect','drafts'])await copyFile(`src/${file}.mjs`,`lib/${file}.mjs`);
await build({entryPoints:['src/client.jsx'],outfile:'lib/client.js',bundle:true,format:'cjs',platform:'browser',target:'chrome120',external:['react','react/jsx-runtime'],loader:{'.css':'text'},banner:{js:'window.__ModuleLoader__.load({id:"dsh-github-connect",factory:(require)=>{var module={exports:{}};var exports=module.exports;'},footer:{js:'return module.exports;}});'}});
console.log('Host + native settings client built');
