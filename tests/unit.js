const fs=require("fs"),vm=require("vm"),assert=require("assert");
function load(path,ctx={}){ctx.window=ctx;ctx.console=console;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path,"utf8"),ctx);return ctx}
let c=load("js/hazards.js");assert.deepStrictEqual(Array.from(c.StormHazards.classify([{properties:{event:"Hurricane Warning"}}])),["tropical"]);assert.strictEqual(c.StormHazards.primary([{properties:{event:"Blizzard Warning"}}]),"winter");assert.strictEqual(c.StormHazards.primary([]),"routine");
c=load("js/marine.js",{fetch:async()=>({ok:true,json:async()=>({stations:[]}),text:async()=>""}),URLSearchParams});const d=c.StormMarine.dist(40,-74,40,-74);assert(d<0.001);assert(c.StormMarine.dist(40,-74,41,-74)>100);
const store={};c=load("js/history.js",{localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},Date});c.StormHistory.capture({locationKey:"A",temperature:50,alertCount:0});c.StormHistory.capture({locationKey:"B",temperature:80,alertCount:2});assert.strictEqual(c.StormHistory.read().length,2);assert.strictEqual(c.StormHistory.nearest("A",24),null);

c=load("js/event.js");let m=c.StormEvent.analyze({properties:{quantitativePrecipitation:{values:[{validTime:new Date().toISOString()+"/PT1H",value:25.4}]},snowfallAmount:{values:[]},windGust:{values:[{validTime:new Date().toISOString()+"/PT1H",value:10}]},temperature:{values:[]}}});assert(Math.abs(m.rainIn-1)<.01);assert(m.gustMph>22&&m.gustMph<23);
c=load("js/nhc.js",{fetch:async()=>({ok:true,json:async()=>({activeStorms:[]})})});assert.deepStrictEqual(Array.from(c.StormNHC.relevant([],40,-74)),[]);


c=load("js/forecast-change.js");let fc=c.StormForecastChange.compare({periods:[{temperature:40,shortForecast:"Rain",windSpeed:"10 mph"}]},{periods:[{temperature:45,shortForecast:"Snow",windSpeed:"25 mph"}]});assert.strictEqual(fc.peakWindDelta,15);assert.strictEqual(fc.firstTemperatureDelta,5);assert.strictEqual(fc.summaryChanged,true);
c=load("js/source-health.js",{Date});assert.strictEqual(c.StormSourceHealth.status(new Date().toISOString()).state,"Fresh");
c=load("js/marine.js",{fetch:async()=>({ok:true,json:async()=>({stations:[]}),text:async()=>""}),URLSearchParams,Date});assert.strictEqual(c.StormMarine.nextHigh([{type:"L",time:"2099-01-01 00:00"},{type:"H",time:"2099-01-01 01:00"}]).type,"H");


c=load("js/coastal.js",{fetch:async()=>({ok:true,json:async()=>({})})});assert.strictEqual(c.StormCoastal.classify(10,{minor:9,moderate:11,major:13}),"minor");assert.strictEqual(c.StormCoastal.margin(8.5,{minor:9}),.5);
const lifeStore={};c=load("js/lifecycle.js",{localStorage:{getItem:k=>lifeStore[k]||null,setItem:(k,v)=>lifeStore[k]=v}});let a=[{id:"x",properties:{event:"Flood Warning",severity:"Moderate",expires:"2026-01-01"}}];assert.strictEqual(c.StormLifecycle.compare(a)[0].type,"issued");a=[{id:"x",properties:{event:"Flood Warning",severity:"Severe",expires:"2026-01-01"}}];assert.strictEqual(c.StormLifecycle.compare(a)[0].type,"upgraded");
console.log("Coastal and lifecycle tests passed");
