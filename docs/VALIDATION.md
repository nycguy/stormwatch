# Nationwide validation matrix

StormWatch should be exercised against these representative locations before major releases.

| Geography | Test location | Expected emphasis |
|---|---|---|
| Northeast inland | Mount Kisco, NY | NWS forecast/alerts, marine hidden unless a genuinely relevant source qualifies |
| Northeast coast | Saco, ME | NWS + nearby NOAA/NDBC marine context |
| Mid-Atlantic coast | Norfolk, VA | Coastal gauge/buoy + tropical/flood modes when alerted |
| Gulf coast | Tampa, FL | Coastal + tropical event behavior |
| Great Lakes | Chicago, IL | NWS core; no ocean tide gauge assumption |
| Plains | Oklahoma City, OK | Severe weather mode; marine hidden |
| Mountain West | Denver, CO | Snow/wind/heat/cold modes; marine hidden |
| Pacific | San Diego, CA | Pacific NOAA/NDBC sources |
| Pacific Northwest | Seattle, WA | Puget Sound water-level context where relevant |
| Alaska | Anchorage, AK | Alaska NWS geography and available coastal sources |
| Hawaii | Honolulu, HI | Pacific marine and tropical context |

Automated CI checks structure and deterministic logic. Browser/network smoke testing remains necessary because upstream public APIs and browser CORS behavior can change independently of StormWatch.
