import { store, json, readJson, getJson, setJson } from './_store.mjs';
const KEY='leaderboard-v1', NAMES='registered-names-v1';
const cleanName = n => String(n || '').trim().slice(0,24);
const norm = n => cleanName(n).toLowerCase();
export default async (event) => {
  const method=event.httpMethod;
  if (method==='OPTIONS') return json(204,{});
  if (method==='GET') {
    const name=cleanName(event.queryStringParameters?.name);
    const rows=await getJson(KEY,[]);
    if (name) { const names=await getJson(NAMES,{}); return json(200,{registered:!!names[norm(name)]}); }
    return json(200, rows.filter(r=>norm(r.name)!=='test123').sort((a,b)=>(Number(b.rebirths)||0)-(Number(a.rebirths)||0)).slice(0,500));
  }
  if (method==='DELETE') {
    const name=cleanName(event.queryStringParameters?.name); if (!name) return json(400,{error:'name required'});
    const key=norm(name);
    const rows=await getJson(KEY,[]); await setJson(KEY,rows.filter(r=>norm(r.name)!==key));
    const names=await getJson(NAMES,{}); delete names[key]; await setJson(NAMES,names);
    const presence=await getJson('presence-v1',{});
    for (const [id,player] of Object.entries(presence)) if (norm(player?.name)===key) delete presence[id];
    await setJson('presence-v1',presence);
    return json(200,{ok:true,deleted:name});
  }
  if (method!=='POST') return json(405,{error:'method not allowed'});
  const b=readJson(event), name=cleanName(b.name), key=norm(name);
  if (!name) return json(400,{error:'name required'});
  if (key==='test123' && b.action!=='register') return json(200,{ok:true,ignored:true});
  if (b.action==='register') {
    const names=await getJson(NAMES,{});
    if (names[key] && names[key]!==name) return json(409,{error:'name already registered'});
    if (names[key]) return json(409,{error:'name already registered'});
    names[key]=name; await setJson(NAMES,names); return json(201,{ok:true});
  }
  const names=await getJson(NAMES,{});
  if (!names[key]) { names[key]=name; await setJson(NAMES,names); }
  else if (names[key]!==name) return json(409,{error:'name already registered'});
  const rows=await getJson(KEY,[]), record={name:names[key],rebirths:Math.max(0,Number(b.rebirths)||0),bestFriend:b.bestFriend&&typeof b.bestFriend==='object'?b.bestFriend:null,totalIncome:Math.max(0,Number(b.totalIncome)||0),playtimeSeconds:Math.max(0,Number(b.playtimeSeconds)||0),updatedAt:Date.now()};
  const i=rows.findIndex(r=>norm(r.name)===key); if(i>=0) rows[i]=record; else rows.push(record);
  await setJson(KEY,rows); return json(200,{ok:true});
};
