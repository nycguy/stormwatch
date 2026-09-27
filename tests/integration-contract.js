#!/usr/bin/env node
const fs=require("fs"),vm=require("vm"),assert=require("assert");
const files=["js/marine.js","js/event.js","js/hourly.js","js/impact.js","js/nhc.js","js/lifecycle.js","js/saved.js","js/confidence.js"];
for(const f of files){const src=fs.readFileSync(f,"utf8");assert(src.length>20,f+" empty");new vm.Script(src,{filename:f})}
const app=fs.readFileSync("js/app.js","utf8");for(const token of["resetLocationUI","StormLifecycle.compare(current.locationKey","StormHourly.blocks","StormImpact.fromHourly","StormMap.setAlertsVisible"])assert(app.includes(token),"app contract missing "+token);
const history=fs.readFileSync(".github/workflows/history.yml","utf8");assert(history.includes("stormwatch-history-writer"));assert(history.includes("git pull --rebase"));
const tracked=JSON.parse(fs.readFileSync("data/tracked-locations.json","utf8"));assert(tracked.some(x=>x.id==="lower-hudson-valley"));assert(!tracked.some(x=>x.id==="nyc-metro"));
console.log("Production integration contracts passed");
