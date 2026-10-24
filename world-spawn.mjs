import { json, readJson, getJson, setJson, isAdmin } from './_store.mjs';
const KEY='world-spawn-v1';
const FRIENDS=new Set(['Maxim','Klara','Alex','Bent','Niklas Malkmuss','Luis','Maya','Hannes','Sarah','Fabian','Amro','George','Mohammed','Fiete','Mirko','Darius','Daschko','Sven Gantner','Ismael','Adelina Raffaela Menendez','Enrique','Antuhan Reyes Menendez','Jörg Fuhrmann','Nicol Fuhrmann','Lukas Feldman','Jens Feicht','Sayiri Feicht','Rick Sanchez','Paulo Kossmann','Elias Langer','Finn Nieminarz','Ben-Luca Weiß','Albert Kossmann','Joel','Sirius Fuhrmann','Kleiner Finn Feicht Fabian','Cederic Szweda','Tom Pearl','Reiner Winkler','Samuel','Dana Egger','Misa Topolo','Mira Schug','Micheal','Valentin Vogel','Sirius Prime','Konstantin','Tim miller','Teurer jeff']);
const MUTATIONS=new Set(['Gold','Diamant','Emerald','Rainbow','Hypercharge']);
export default async(event)=>{
 if(event.httpMethod==='GET') return json(200,await getJson(KEY,null));
 if(event.httpMethod!=='POST') return json(405,{error:'method not allowed'});
 const b=readJson(event); if(!isAdmin(b)) return json(403,{error:'admin only'});
 const friend=String(b.friend||''); if(!FRIENDS.has(friend)) return json(400,{error:'unknown friend'});
 const mutations=Array.isArray(b.mutations)?b.mutations.filter(m=>MUTATIONS.has(m)).slice(0,20):[];
 const spawn={id:`${Date.now()}-${Math.random().toString(36).slice(2,10)}`,friend,mutations,createdAtMs:Date.now(),by:'test123'};
 await setJson(KEY,spawn); return json(200,spawn);
};
