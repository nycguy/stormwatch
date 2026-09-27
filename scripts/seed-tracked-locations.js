#!/usr/bin/env node
const fs=require("fs"),path=require("path"),file="data/tracked-locations.json";
const base=[
{id:"nyc-metro",name:"NYC Metro",lat:41.2043,lon:-73.7271},
{id:"new-england-coast",name:"New England Coast",lat:43.50,lon:-70.44},
{id:"mid-atlantic",name:"Mid-Atlantic Coast",lat:36.85,lon:-76.29},
{id:"gulf",name:"Gulf Coast",lat:27.95,lon:-82.46},
{id:"southern-california",name:"Southern California",lat:32.72,lon:-117.16},
{id:"pacific-northwest",name:"Pacific Northwest",lat:47.61,lon:-122.33},
{id:"hawaii",name:"Hawaii",lat:21.31,lon:-157.86},
{id:"alaska",name:"Southcentral Alaska",lat:61.22,lon:-149.90}
];fs.mkdirSync(path.dirname(file),{recursive:true});if(!fs.existsSync(file))fs.writeFileSync(file,JSON.stringify(base,null,2)+"\n");console.log("Tracked locations:",JSON.parse(fs.readFileSync(file)).length);
