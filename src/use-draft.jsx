import {useEffect,useRef,useState} from 'react';
export function useDraft(apiCall, key, value, restore) {
  const [ready,setReady]=useState(false),[saved,setSaved]=useState(''),[error,setError]=useState('');
  const edited=useRef(false),timer=useRef(null),element=useRef(null);
  useEffect(()=>{let live=true;apiCall('draft/get',key).then(d=>{if(live&&!edited.current&&d)restore(d);}).catch(e=>{if(live)setError(e.message);}).finally(()=>{if(live)setReady(true);});return()=>{live=false;clearTimeout(timer.current);};},[]);
  useEffect(()=>{if(!ready)return;timer.current=setTimeout(()=>{apiCall('draft/save',{...key,...value}).then(r=>{setSaved(r.savedAt);setError('');}).catch(e=>setError(e.message));},700);return()=>clearTimeout(timer.current);},[ready,JSON.stringify(value)]);
  useEffect(()=>{const form=element.current?.closest('form');const cancel=()=>clearTimeout(timer.current);form?.addEventListener('submit',cancel);return()=>form?.removeEventListener('submit',cancel);},[]);
  return {element,edit:()=>{edited.current=true;},saved,error,ready};
}
