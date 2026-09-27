#!/usr/bin/env node
const tests=[
 ["NWS Mount Kisco","https://api.weather.gov/points/41.2043,-73.7271",async r=>{const j=await r.json();return !!j.properties?.forecast}],
 ["NWS Saco","https://api.weather.gov/points/43.5009,-70.4428"],
 ["NWS Tampa","https://api.weather.gov/points/27.9506,-82.4572"],
 ["NWS San Diego","https://api.weather.gov/points/32.7157,-117.1611"],
 ["NHC current storms","https://www.nhc.noaa.gov/CurrentStorms.json",async r=>{const j=await r.json();return Array.isArray(j.activeStorms)||Array.isArray(j.storms)}],
 ["NOAA station metadata","https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=waterlevels",async r=>{const j=await r.json();return Array.isArray(j.stations)&&j.stations.length>0}],
 ["NOAA Portland flood levels","https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/8418150/floodlevels.json",async r=>{const j=await r.json(),x=j.floodlevels||j.floodLevels||j;return ["nws_minor","nos_minor"].some(k=>Number.isFinite(+x[k]))}],
 ["NDBC latest observations","https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt",async r=>(await r.text()).includes("#STN")],
 ["NOAA radar WMS","https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?service=WMS&request=GetCapabilities"]
];
(async()=>{let fail=0;for(const [name,url,validate] of tests){try{const r=await fetch(url,{headers:{"User-Agent":"StormWatch CI github.com/nycguy/stormwatch"}}),clone=r.clone();let valid=r.ok;if(valid&&validate)valid=await validate(clone);console.log(name,r.status,r.headers.get("content-type")||"",valid?"valid":"INVALID");if(!valid)fail++}catch(e){console.error(name,e.message);fail++}}if(fail)process.exit(1)})();