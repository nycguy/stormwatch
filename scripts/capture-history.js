#!/usr/bin/env node
const fs=require("fs");
const locations=[
 {id:"northeast-coast",name:"Northeast Coast",lat:43.50,lon:-70.44},
 {id:"mid-atlantic",name:"Mid-Atlantic Coast",lat:36.85,lon:-76.29},
 {id:"gulf",name:"Gulf Coast",lat:27.95,lon:-82.46},
 {id:"pacific-south",name:"Southern California Coast",lat:32.72,lon:-117.16},
 {id:"pacific-northwest",name:"Pacific Northwest",lat:47.61,lon:-122.33},
 {id:"hawaii",name:"Hawaii",lat:21.31,lon:-157.86},
 {id:"alaska",name:"Southcentral Alaska",lat:61.22,lon:-149.90}
];
const H={"User-Agent":"StormWatch/1.0 github.com/nycguy/stormwatch","Accept":"application/geo+json"};
async function json(u){const r=await fetch(u,{headers:H});if(!r.ok)throw Error(r.status+" "+u);return r.json()}
async function one(x){try{const p=await json(`https://api.weather.gov/points/${x.lat},${x.lon}`),a=await json(`https://api.weather.gov/alerts/active?point=${x.lat},${x.lon}`),f=await json(p.properties.forecast);const periods=f.properties.periods||[],winds=periods.flatMap(v=>(v.windSpeed||"").match(/\d+/g)||[]).map(Number);return{...x,capturedAt:new Date().toISOString(),cwa:p.properties.cwa,alertCount:(a.features||[]).length,alerts:(a.features||[]).slice(0,8).map(v=>v.properties.event),peakWindMph:winds.length?Math.max(...winds):null,periods:periods.slice(0,8).map(v=>({name:v.name,startTime:v.startTime,temperature:v.temperature,unit:v.temperatureUnit,shortForecast:v.shortForecast,windSpeed:v.windSpeed,windDirection:v.windDirection}))}}catch(e){return{...x,capturedAt:new Date().toISOString(),error:String(e.message||e)}}}
(async()=>{const dir="data/history",today=new Date().toISOString().slice(0,10);fs.mkdirSync(dir,{recursive:true});const current=await Promise.all(locations.map(one));fs.writeFileSync("data/current.json",JSON.stringify({generatedAt:new Date().toISOString(),locations:current},null,2)+"\n");const path=`${dir}/${today}.json`,old=fs.existsSync(path)?JSON.parse(fs.readFileSync(path,"utf8")):[];old.push({capturedAt:new Date().toISOString(),locations:current});fs.writeFileSync(path,JSON.stringify(old.slice(-96),null,2)+"\n")})().catch(e=>{console.error(e);process.exit(1)});
