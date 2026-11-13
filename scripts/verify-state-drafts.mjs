import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL??'msedge'});
try{
 const page=await browser.newPage();let logged=true;const drafts=new Map(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://localhost:3199/**',async route=>{
  const url=new URL(route.request().url());let result={};
  if(!url.pathname.startsWith('/dsh-github/api/'))return route.fulfill({contentType:'text/html',body:'<div id="root"></div>'});
  const name=url.pathname.split('/api/')[1],a=route.request().postDataJSON()??{},key=a.kind==='repository'?'repository':a.owner+'/'+a.repo;
  if(name==='state')result={user:logged?{id:1,login:'demo',name:'Demo'}:null,hasCredential:logged,errorKind:logged?null:'network',clientId:'',login:{state:'idle'},operations:[],attachments:[]};
  if(name==='repos')result={repositories:[{owner:'demo',name:'project',full_name:'demo/project',default_branch:'main'}],page:1,hasMore:false};
  if(name==='releases')result=[];
  if(name==='draft/get')result=drafts.get(key)??null;
  if(name==='draft/save'){drafts.set(key,a);result={savedAt:new Date().toISOString()};}
  if(name==='auth/logout')logged=false;
  await route.fulfill({contentType:'application/json',body:JSON.stringify(result)});
 });
 await page.goto('http://localhost:3199/');
 await page.addScriptTag({path:'node_modules/react/umd/react.development.js'});
 await page.addScriptTag({path:'node_modules/react-dom/umd/react-dom.development.js'});
 await page.evaluate(()=>window.__ModuleLoader__={load:r=>window.plugin=r.factory(()=>window.React)});
 await page.addScriptTag({path:'lib/client.js'});
 await page.evaluate(()=>ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.plugin.GitHubSettings)));
 await page.getByRole('button',{name:'新建仓库',exact:true}).click();
 await page.locator('#gh-new-repo-description').fill('draft description');
 await page.waitForFunction(()=>document.querySelector('[role="status"]')?.textContent?.includes('保存')||document.body.textContent.includes('介绍已自动保存'));
 await page.getByRole('button',{name:'程序发布',exact:true}).click();
 await page.getByRole('button',{name:'仓库',exact:true}).click();
 await page.locator('#gh-new-repo-description').waitFor();
 await page.waitForFunction(()=>document.querySelector('#gh-new-repo-description').value==='draft description');
 await page.getByRole('button',{name:'程序发布',exact:true}).click();
 await page.getByLabel('发布目标仓库').selectOption('demo/project');
 await page.locator('#gh-release-title').fill('Release draft');
 await page.locator('#gh-release-body').fill('Release notes');
 await page.getByText('文案已自动保存',{exact:true}).waitFor();
 await page.getByRole('button',{name:'仓库',exact:true}).click();
 await page.getByRole('button',{name:'程序发布',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('#gh-release-body')?.value==='Release notes');
 await page.getByRole('button',{name:'断开连接',exact:true}).click();
 await page.getByRole('button',{name:'登录 GitHub',exact:true}).waitFor();
 assert.equal(drafts.get('demo/project').title,'Release draft');assert.deepEqual(errors,[]);
 console.log('Browser: repository/release drafts restore and logout verified');
}finally{await browser.close();}
