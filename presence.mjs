import { json, readJson, getJson, setJson } from './_store.mjs';
const KEY='presence-v1', TTL=55000;
const clean=n=>String(n||'').trim().slice(0,24);
export default async (event) => {
  const now=Date.now(); let players=await getJson(KEY,{});
  for(const [id,p] of Object.entries(players)) if(!p || now-(Number(p.lastSeen)||0)>TTL) delete players[id];
  if(event.httpMethod==='GET') { await setJson(KEY,players); const list=Object.values(players).filter(p=>String(p.name).toLowerCase()!=='test123'); return json(200,{onlineCount:list.length,players:list}); }
  if(event.httpMethod!=='POST') return json(405,{error:'method not allowed'});
  const b=readJson(event), id=String(b.sessionId||'').slice(0,100);
  if(b.action==='leave') delete players[id];
  else if(!id||!clean(b.name)) return json(400,{error:'sessionId and name required'});
  else if(clean(b.name).toLowerCase()!=='test123') players[id]={name:clean(b.name),stats:b.stats&&typeof b.stats==='object'?b.stats:{},lastSeen:now};
  else delete players[id];
  await setJson(KEY,players); const list=Object.values(players).filter(p=>String(p.name).toLowerCase()!=='test123'); return json(200,{onlineCount:list.length,players:list});
};
