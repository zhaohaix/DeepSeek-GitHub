import os from 'node:os';
import path from 'node:path';
import {createTransport} from './network.mjs';
import {GhAuth} from './gh.mjs';
import {harnessCredentialStore} from './credential-store.mjs';
import {registerMobilePanel} from './dsh-go.mjs';
import {GitHub,Operations} from './core.mjs';
import {routes} from './http.mjs';
import {definitions,localAgent} from './tools.mjs';
import {createDiagnostics} from './diagnostics.mjs';
import {ReleaseCopy} from './release-copy.mjs';
import {Drafts} from './drafts.mjs';

export const name='github-connect';
export function apply(ctx){
  ctx.inject(['webServer','tools','connection'],async host=>{
    const root=path.join(process.env.DSH_HOME??path.join(os.homedir(),'.dsh'),'github-connect');
    const diagnostics=createDiagnostics(root);diagnostics('plugin_started');
    const transport=createTransport();
    // Read the live service so Linux does not depend on plugin startup order.
    const credentialStore=process.platform==='linux'?harnessCredentialStore(()=>host.get('credentials')):undefined;
    const auth=new GhAuth(root,{diagnostics,fetchImpl:transport.fetch,credentialStore}),api=new GitHub({auth,diagnostics,fetchImpl:transport.fetch}),ops=new Operations(api,{root});await ops.init();
    const releaseCopy=new ReleaseCopy({api,ctx:host,root,ops});
    const drafts=new Drafts({root});
    for(const route of routes({api,ops,auth,root,releaseCopy,drafts,connection:()=>host.get('connection')}))host.effect(()=>host.webServer.register(route));
    for(const definition of definitions(api,ops))host.effect(()=>host.tools.register(definition,{when:({agent})=>localAgent(agent)}));
    host.inject?.(['dshGo'],mobile=>registerMobilePanel(mobile,{auth,api,ops}));
    host.on('dispose',()=>{diagnostics('plugin_stopped');auth.dispose();transport.close().catch(()=>{});ops.clearPending();});
  });
}
