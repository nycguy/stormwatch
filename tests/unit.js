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
const lifeStore={};c=load("js/lifecycle.js",{localStorage:{getItem:k=>lifeStore[k]||null,setItem:(k,v)=>lifeStore[k]=v}});let a=[{id:"x",properties:{event:"Flood Warning",severity:"Moderate",expires:"2026-01-01"}}];assert.strictEqual(c.StormLifecycle.compare("A",a)[0].type,"issued");assert.strictEqual(c.StormLifecycle.compare("B",[]).length,0);a=[{id:"x",properties:{event:"Flood Warning",severity:"Severe",expires:"2026-01-01"}}];assert.strictEqual(c.StormLifecycle.compare("A",a)[0].type,"upgraded");


c=load("js/timing.js");let ti=c.StormTiming.alerts([{properties:{event:"Winter Storm Warning",onset:new Date(Date.now()+7200000).toISOString(),expires:new Date(Date.now()+21600000).toISOString()}}]);assert(ti[0].minutesToOnset>=119&&ti[0].minutesToOnset<=121);assert(c.StormTiming.label(ti[0]).includes("begins in"));
c=load("js/forecast-change.js");fc=c.StormForecastChange.compare({periods:[{startTime:"x",temperature:40,shortForecast:"Rain",windSpeed:"10 mph"}]},{periods:[{startTime:"x",temperature:46,shortForecast:"Snow",windSpeed:"20 mph"}]});assert(fc.shifts.length>=2);assert(c.StormForecastChange.narrative(fc).includes("Forecast changes"));
c=load("js/marine.js",{fetch:async()=>({ok:true,json:async()=>({stations:[]}),text:async()=>""}),URLSearchParams,Date});let pk=c.StormMarine.forecastPeak([{time:"2099-01-01 00:00",value:3},{time:"2099-01-01 01:00",value:5}]);assert.strictEqual(pk.value,5);


c=load("js/impact.js");let im=c.StormImpact.build("winter",[{name:"Tonight",shortForecast:"Snow",windSpeed:"20 mph"}],{snowIn:5});assert.strictEqual(im[0].title,"Winter impacts possible");
c=load("js/webcams.js");assert.strictEqual(c.StormWebcams.candidates({label:"Test",lat:40,lon:-74}).length,0);


c=load("js/persistence.js",{StormWatchConfig:{historyApi:""},fetch:async()=>{throw Error("should not fetch")}});let pn=c.StormPersistence.normalize({lat:41.2043,lon:-73.7271,label:"Mount Kisco"});assert.strictEqual(pn.key,"41.20,-73.73");c.StormPersistence.register(pn).then(x=>assert.strictEqual(x.mode,"static"));
console.log("Persistence contract tests passed");

c=load("js/saved.js",{localStorage:{getItem:()=>null,setItem:()=>{}},location:{search:"?lat=999&lon=-73",href:"https://example.test/"},URLSearchParams,URL});assert.strictEqual(c.StormSaved.fromUrl(),null);
console.log("Location isolation and URL validation tests passed");

c=load("js/event.js");const now=Date.now(),iso=t=>new Date(t).toISOString();let acc=c.StormEvent.total({values:[{validTime:iso(now)+"/PT6H",value:12.7},{validTime:iso(now+6*3600000)+"/PT6H",value:12.7}]},12,now);assert(Math.abs(acc-25.4)<.01);
c=load("js/hourly.js",{Date});let hp=Array.from({length:24},(_,i)=>({startTime:new Date(Date.now()+i*3600000).toISOString(),temperature:40+i%6,windSpeed:(10+i%4)+" mph",shortForecast:"Cloudy",probabilityOfPrecipitation:{value:20}}));assert.strictEqual(c.StormHourly.blocks(hp).length,4);
c=load("js/coastal.js",{fetch:async()=>({ok:true,json:async()=>({nws_minor:9,nws_moderate:10,nws_major:11})})});assert.deepStrictEqual(JSON.parse(JSON.stringify(c.StormCoastal.thresholds({nws_minor:9,nws_moderate:10,nws_major:11}))),{minor:9,moderate:10,major:11});
console.log("24-hour accumulation, hourly timeline, and NOAA flood metadata tests passed");

c=load("js/hazards.js");assert.strictEqual(c.StormHazards.modeled({snowIn:3}),"winter");assert.strictEqual(c.StormHazards.modeled({rainIn:1.2}),"flood");assert.strictEqual(c.StormHazards.modeled({gustMph:45}),"wind");assert.strictEqual(c.StormHazards.modeled({}),"routine");
console.log("Modeled hazard promotion tests passed");

c=load("js/marine.js",{fetch:async()=>({ok:true,json:async()=>({}),text:async()=>""}),URLSearchParams,Date});let rr=c.StormMarine.matchResidual([{t:"2026-09-28 12:06",v:"4.20"}],[{t:"2026-09-28 12:00",v:"3.80"},{t:"2026-09-28 12:06",v:"3.90"}]);assert(Math.abs(rr.residual-.3)<.001);assert.strictEqual(rr.matchMinutes,0);assert.strictEqual(c.StormMarine.matchResidual([{t:"2026-09-28 12:20",v:"4"}],[{t:"2026-09-28 12:00",v:"3"}],8),null);
c=load("js/nhc.js",{fetch:async()=>({ok:true,json:async()=>({activeStorms:[]})})});assert.deepStrictEqual(JSON.parse(JSON.stringify(c.StormNHC.point({latitude:"25.5N",longitude:"70.2W"}))),{lat:25.5,lon:-70.2});
c=load("js/impact.js");let ib=c.StormImpact.fromHourly("wind",[{start:new Date(),summary:"Cloudy",wind:35,pop:10}],{gustMph:45});assert.strictEqual(ib[0].title,"Strong-wind concern");
console.log("Marine residual, NHC coordinate, and hourly impact tests passed");

c=load("js/saved.js",{localStorage:{getItem:()=> "[]",setItem:()=>{}},location:{search:"?lat=91&lon=-73",href:"https://example.test/"},URLSearchParams,URL});assert.strictEqual(c.StormSaved.fromUrl(),null);assert.strictEqual(c.StormSaved.valid({lat:41.2,lon:-73.7}),true);assert.strictEqual(c.StormSaved.valid({lat:NaN,lon:-73.7}),false);
console.log("Saved location validation tests passed");

c=load("js/event.js");const accumulationNow=Date.parse("2026-09-28T00:00:00Z"),prop={values:[{validTime:"2026-09-28T00:00:00Z/PT6H",value:25.4},{validTime:"2026-09-28T06:00:00Z/PT6H",value:25.4}]};assert(Math.abs(c.StormEvent.total(prop,12,accumulationNow)-50.8)<.001);assert.strictEqual(c.StormEvent.durationMs("PT1H30M"),5400000);
console.log("NWS valid-time accumulation tests passed");

c=load("js/coastal.js",{fetch:async()=>({ok:true,json:async()=>({})})});assert.deepStrictEqual(JSON.parse(JSON.stringify(c.StormCoastal.thresholds({floodlevels:[{nws_minor:"11.1",nws_moderate:"12.2",nws_major:"13.3"}]}))),{minor:11.1,moderate:12.2,major:13.3});assert.strictEqual(c.StormCoastal.classify(10,{}),null);
console.log("NOAA flood-level payload tests passed");

c=load("js/event.js");const timingNow=Date.parse("2026-09-28T00:00:00Z"),timingProp={values:[{validTime:"2026-09-28T00:00:00Z/PT6H",value:12.7},{validTime:"2026-09-28T06:00:00Z/PT6H",value:50.8},{validTime:"2026-09-28T12:00:00Z/PT6H",value:25.4}]};let wet=c.StormEvent.wettestWindow(timingProp,18,timingNow,6,x=>x/25.4);assert.strictEqual(wet.value,2);assert(wet.start.includes("06:00:00"));
c=load("js/coastal.js",{fetch:async()=>({ok:true,json:async()=>({})})});let co=c.StormCoastal.outlook(9.5,{minor:10,moderate:11,major:12});assert.strictEqual(co.classification,"below flood threshold");assert.strictEqual(co.minorMargin,.5);co=c.StormCoastal.outlook(10.2,{minor:10,moderate:11,major:12});assert.strictEqual(co.classification,"minor");assert(Math.abs(co.minorMargin+.2)<.001);
c=load("js/confidence.js");assert.strictEqual(c.StormConfidence.assess({alerts:1,grid:true,hourly:true}).level,"high");assert(c.StormConfidence.provenance(["alert","grid"]).includes("Official NWS alert"));
console.log("Hazard timing, coastal outlook, and provenance tests passed");

c=load("js/marine.js",{fetch:async()=>({ok:true,json:async()=>({}),text:async()=>""}),URLSearchParams,Date});let ex=c.StormMarine.forecastExtrema([{time:"2099-01-01 00:00",value:2},{time:"2099-01-01 06:00",value:7},{time:"2099-01-01 12:00",value:1}]);assert.strictEqual(ex.peak.value,7);assert.strictEqual(ex.low.value,1);assert.strictEqual(ex.range,6);
console.log("Tidal extrema tests passed");

c=load("js/hourly.js",{Date});const pn=Date.parse("2026-09-28T00:00:00Z"),wetPeriods=Array.from({length:8},(_,i)=>({startTime:new Date(pn+i*3600000).toISOString(),endTime:new Date(pn+(i+1)*3600000).toISOString(),temperature:60,windSpeed:"10 mph",shortForecast:i>=2&&i<=4?"Rain":"Cloudy",probabilityOfPrecipitation:{value:i>=2&&i<=4?70:10},isDaytime:i>=6}));let pw=c.StormHourly.precipWindow(wetPeriods,pn,8);assert(pw.start.includes("02:00:00"));assert(pw.end.includes("05:00:00"));let bl=c.StormHourly.blocks(wetPeriods,pn,8,4);assert.strictEqual(bl[0].daypart,"Night");assert.strictEqual(bl[1].daypart,"Transition");
c=load("js/marine.js",{fetch:async()=>({ok:true,json:async()=>({}),text:async()=>""}),URLSearchParams,Date});let rt=c.StormMarine.residualTrend([{time:"2026-09-28 00:00",residual:.1},{time:"2026-09-28 06:00",residual:.5}]);assert.strictEqual(rt.direction,"rising");assert(Math.abs(rt.delta-.4)<.001);
c=load("js/next.js",{Date});let nx=c.StormNext.build({precip:{type:"rain",start:"2026-09-28T02:00:00Z",end:"2026-09-28T05:00:00Z",peakPop:80},peakWind:{value:45,time:"2026-09-28T04:00:00Z"}});assert.strictEqual(nx.length,2);assert(nx[0].includes("Strongest stated wind"));
console.log("Precipitation window, daylight, surge trend, and next-summary tests passed");
