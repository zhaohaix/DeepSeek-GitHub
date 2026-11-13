import {build} from 'esbuild';
import {mkdir,copyFile,readFile} from 'node:fs/promises';
// The client bundle registers itself under the package name — DSH maps the
// browser half by package name, so a hard-coded id breaks after a rename.
const pkg=JSON.parse(await readFile('package.json','utf8'));
await mkdir('lib',{recursive:true});
await copyFile('src/publisher.json','lib/publisher.json');
for(const file of ['index','core','gh','http','tools','search','diagnostics','release-copy','repository-name','program-inspect','drafts','session-state'])await copyFile(`src/${file}.mjs`,`lib/${file}.js`);
// Keep source module extensions for the Node entry's relative imports.
for(const file of ['core','gh','http','tools','search','diagnostics','release-copy','repository-name','program-inspect','drafts','session-state'])await copyFile(`src/${file}.mjs`,`lib/${file}.mjs`);
await build({entryPoints:['src/client.jsx'],outfile:'lib/client.js',bundle:true,format:'cjs',platform:'browser',target:'chrome120',external:['react','react/jsx-runtime'],loader:{'.css':'text'},banner:{js:`window.__ModuleLoader__.load({id:"${pkg.name}",factory:(require)=>{var module={exports:{}};var exports=module.exports;`},footer:{js:'return module.exports;}});'}});
console.log('Host + native settings client built');
