import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mergeConnectionState} from '../src/session-state.mjs';
test('退出登录和无凭据状态清除旧账号；临时网络故障保留账号并更新操作记录',()=>{
 const prev={user:{id:1},hasCredential:true,operations:[]};
 const next={user:null,hasCredential:false,errorKind:'network'};
 assert.equal(mergeConnectionState(prev,next).user,null);
 const transient={user:null,hasCredential:true,errorKind:'network',operations:[{status:'completed'}]};
 assert.deepEqual(mergeConnectionState(prev,transient),{...transient,user:prev.user});
 assert.equal(mergeConnectionState(prev,{...transient,errorKind:'auth'}).user,null);
});
