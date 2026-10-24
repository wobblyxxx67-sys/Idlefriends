import { json, readJson, getJson, setJson, isAdmin } from './_store.mjs';
const KEY='world-event-v1';
const valid=e=>e&&['luck','income','diamondOnly'].includes(e.type)&&Number.isFinite(Number(e.multiplier))&&Number(e.multiplier)>=1&&Number(e.multiplier)<=12;
export default async (event)=>{
  const now=Date.now(); let state=await getJson(KEY,{events:[],updatedAt:0});
  state.events=(Array.isArray(state.events)?state.events:[]).filter(e=>Number(e.expiresAt)>now);
  if(event.httpMethod==='GET'){await setJson(KEY,state);return json(200,{events:state.events,event:null,updatedAt:state.updatedAt});}
  if(event.httpMethod!=='POST') return json(405,{error:'method not allowed'});
  const b=readJson(event); if(!isAdmin(b)) return json(403,{error:'admin only'});
  if(b.action==='clear') state.events=[];
  else if(b.action==='start') {
    const incoming=(Array.isArray(b.events)&&b.events.length?b.events:[b.event]).filter(valid);
    if(!incoming.length) return json(400,{error:'invalid event'});
    for(const e of incoming){const type=e.type, mult=Number(e.multiplier)||1; state.events=state.events.filter(old=>!(old.type===type && Number(old.multiplier)===mult));state.events.push({...e,multiplier:mult,startedAt:now,expiresAt:now+60000,id:`${now}-${Math.random().toString(36).slice(2,8)}`});}
  } else return json(400,{error:'invalid action'});
  state.updatedAt=now; await setJson(KEY,state); return json(200,{ok:true,events:state.events,event:null,updatedAt:now});
};
