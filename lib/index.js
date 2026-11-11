import os from 'node:os';
import path from 'node:path';
import {GhAuth} from './gh.mjs';
import {GitHub,Operations} from './core.mjs';
import {routes} from './http.mjs';
import {definitions,localAgent} from './tools.mjs';
import {createDiagnostics} from './diagnostics.mjs';
import {ReleaseCopy} from './release-copy.mjs';

export const name='github-connect';
export function apply(ctx){
  ctx.inject(['webServer','tools','connection'],async host=>{
    const root=path.join(process.env.DSH_HOME??path.join(os.homedir(),'.dsh'),'github-connect');
    const diagnostics=createDiagnostics(root);diagnostics('plugin_started');
    const auth=new GhAuth(root,{diagnostics}),api=new GitHub({auth,diagnostics}),ops=new Operations(api,{root});await ops.init();
    const releaseCopy=new ReleaseCopy({api,ctx:host,root,ops});
    for(const route of routes({api,ops,auth,root,releaseCopy,connection:()=>host.get('connection')}))host.effect(()=>host.webServer.register(route));
    for(const definition of definitions(api,ops))host.effect(()=>host.tools.register(definition,{when:({agent})=>localAgent(agent)}));
    host.on('dispose',()=>{diagnostics('plugin_stopped');ops.clearPending();});
  });
}
