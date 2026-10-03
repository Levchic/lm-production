/* Паттерны из сборника Pocket Operations (Paul Wenzel), лицензия CC BY.
   Источник: https://shittyrecording.studio/ — перенесено из Music Projects/BeatLibrary. */
window.DRUM_PATTERNS = [
  // ── BASIC ──
  {name:"One and Seven",genre:"Basic",inst:{BD:[1,7],SN:[5,13]},tags:["minimal"]},
  {name:"Boots n' Cats",genre:"Basic",inst:{BD:[1,9],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:[]},
  {name:"Tiny House",genre:"Basic",inst:{OH:[3,7,11,15],BD:[1,5,9,13]},tags:["minimal"]},
  {name:"Good to Go",genre:"Basic",inst:{BD:[1,4,7,11],SN:[5,13]},tags:["minimal"]},
  {name:"Hip Hop (basic)",genre:"Basic",inst:{BD:[1,3,7,8,15],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:[]},
  // ── STANDARD BREAKS ──
  {name:"Standard Break 1",genre:"Breaks",inst:{BD:[1,11],SN:[5,13],CH:[1,3,5,7,9,10,11,13,15]},tags:[]},
  {name:"Standard Break 2",genre:"Breaks",inst:{BD:[1,11],SN:[5,13],CH:[1,3,5,7,8,9,11,15]},tags:[]},
  {name:"Rolling Break",genre:"Breaks",inst:{BD:[1,8,11],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:["rolling"]},
  {name:"The Unknown Drummer",genre:"Breaks",inst:{BD:[1,4,7,11],SN:[2,5,8,13],CH:[2,3,5,6,8,14],OH:[9,15]},tags:["complex"]},
  // ── STANDARD BREAKBEATS ──
  {name:"Standard Breakbeat 1",genre:"Breaks",inst:{BD:[1,11],SN:[5,13]},tags:["minimal"]},
  {name:"Standard Breakbeat 2",genre:"Breaks",inst:{BD:[1,3,11],SN:[5,13]},tags:["minimal"]},
  {name:"Standard Breakbeat 3",genre:"Breaks",inst:{BD:[1,3,7,11],SN:[5,8,10,13]},tags:[]},
  {name:"Polyrhythmic",genre:"Breaks",sub:"A/B",inst:{BD:[1,7],SN:[3,5,9,11,12,13,15,16]},tags:["ab","complex"]},
  // ── HYBRID BREAKS ──
  {name:"Hybrid Kick",genre:"Breaks",sub:"+ endings 1–6",inst:{BD:[1,9],SN:[5,13]},tags:["ab"]},
  {name:"Hybrid Kick 7",genre:"Breaks",sub:"A/B",inst:{BD:[1,3,9,11],SN:[5,13]},tags:["ab"]},
  {name:"Hybrid 8",genre:"Breaks",sub:"A/B",inst:{BD:[1,9,11],SN:[5,13]},tags:["ab"]},
  // ── IRREGULAR BREAKS ──
  {name:"Irregular 1",genre:"Breaks",sub:"A/B",inst:{BD:[1,3,4,7,11],SN:[5,8,13,16]},tags:["ab","complex"]},
  {name:"Irregular 2",genre:"Breaks",sub:"A/B",inst:{BD:[1,8,11],SN:[4,13]},tags:["ab"]},
  {name:"Irregular 3",genre:"Breaks",inst:{BD:[1,4,9,15],SN:[2,5,11,14]},tags:["complex"]},
  // ── ROLLING BREAKS ──
  {name:"Rolling 1",genre:"Breaks",inst:{BD:[1,11],SN:[5,13]},tags:["rolling","minimal"]},
  {name:"Rolling 2",genre:"Breaks",inst:{BD:[1,11,14],SN:[5,13]},tags:["rolling"]},
  {name:"Rolling 3",genre:"Breaks",sub:"A/B",inst:{BD:[1,7,13],SN:[5,11]},tags:["rolling","ab"]},
  {name:"Rolling 4",genre:"Breaks",sub:"A/B",inst:{BD:[1,2],SN:[5,13]},tags:["rolling","ab"]},
  {name:"Rolling 5",genre:"Breaks",sub:"A/B",inst:{BD:[1,3,11],SN:[5,13]},tags:["rolling","ab"]},
  {name:"Rolling 6",genre:"Breaks",sub:"A/B",inst:{BD:[1,7,12],SN:[5,13]},tags:["rolling","ab"]},
  {name:"Rolling 7",genre:"Breaks",sub:"A/B/C/D",inst:{BD:[1,8,9,12],SN:[5,13]},tags:["rolling","ab"]},
  {name:"Rolling 8",genre:"Breaks",inst:{BD:[1,8],SN:[5,13]},tags:["rolling"]},
  {name:"Rolling 9",genre:"Breaks",sub:"A/B",inst:{BD:[1,9,11],SN:[5,13]},tags:["rolling","ab"]},
  {name:"Rolling 10",genre:"Breaks",inst:{BD:[1,8,12],SN:[5,13]},tags:["rolling"]},
  {name:"Rolling 11",genre:"Breaks",inst:{BD:[1,6,7,10,11],SN:[5,13]},tags:["rolling","complex"]},
  // ── BREAKS – SNARE ──
  {name:"Contemporary Snare 1",genre:"Breaks",sub:"A/B",inst:{BD:[1,11],SN:[5,10,15]},tags:["ab"]},
  {name:"Contemporary Snare 2",genre:"Breaks",sub:"A/B",inst:{BD:[1,3,11],SN:[5,13]},tags:["ab"]},
  {name:"Contemporary Snare 3",genre:"Breaks",sub:"A/B",inst:{BD:[1,7,15],SN:[5,11,14,16]},tags:["ab","complex"]},
  {name:"Unconventional Snare 1",genre:"Breaks",sub:"A/B",inst:{BD:[1,5,11],SN:[9,15]},tags:["ab"]},
  {name:"Unconventional Snare 2",genre:"Breaks",sub:"A/B",inst:{BD:[1,13],SN:[5,9,12]},tags:["ab"]},
  {name:"Unconventional Snare 3",genre:"Breaks",sub:"A/B",inst:{BD:[1,7,14],SN:[5,11]},tags:["ab"]},
  {name:"Unconventional Snare 4",genre:"Breaks",sub:"A/B",inst:{BD:[1,3,7,9],SN:[5,11]},tags:["ab"]},
  // ── GHOST SNARES ──
  {name:"Ghost Snare 1",genre:"Breaks",sub:"A/B",inst:{SN:[5,8,10,13,16]},tags:["ab","minimal"]},
  {name:"Ghost Snare 2",genre:"Breaks",sub:"A/B",inst:{SN:[2,5,8,13,16]},tags:["ab","minimal"]},
  // ── BREAKS – KICK ──
  {name:"Contemporary Kick 1",genre:"Breaks",sub:"A/B",inst:{BD:[1,11],SN:[5,15]},tags:["ab","minimal"]},
  {name:"Contemporary Kick 2",genre:"Breaks",sub:"A/B",inst:{BD:[3,8,11],SN:[5,10,13]},tags:["ab"]},
  {name:"Contemporary Kick 3",genre:"Breaks",sub:"A/B",inst:{BD:[1,11],SN:[5,15]},tags:["ab","minimal"]},
  {name:"Contemporary Kick 4",genre:"Breaks",inst:{BD:[1,9],SN:[5,11]},tags:["minimal"]},
  // ── ROCK ──
  {name:"Rock 1",genre:"Rock",inst:{BD:[1,8,9,11],SN:[5,13],CY:[1],CH:[1,3,5,7,9,11,13,15]},tags:["heavy"]},
  {name:"Rock 2",genre:"Rock",inst:{BD:[1,8,9,11],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:["heavy"]},
  {name:"Rock 3",genre:"Rock",inst:{BD:[1,8,9,11],SN:[5,13],OH:[15],CH:[1,3,5,7,9,11,13,15]},tags:["heavy"]},
  {name:"Rock 4",genre:"Rock",inst:{BD:[1,8,9,11],SN:[5,13,15,16],OH:[15],CH:[1,3,5,7,9,11,13,15]},tags:["heavy","complex"]},
  // ── ELECTRO ──
  {name:"Electro 1",genre:"Electro",sub:"A/B",inst:{SN:[5,13],BD:[1,7]},tags:["ab","minimal"]},
  {name:"Electro 2",genre:"Electro",sub:"A/B",inst:{SN:[5,13],BD:[1,11,14]},tags:["ab"]},
  {name:"Electro 3",genre:"Electro",sub:"A/B",inst:{SN:[5,13],BD:[1,7,12]},tags:["ab"]},
  {name:"Electro 4",genre:"Electro",inst:{SN:[5,13],BD:[1,7,11,14]},tags:[]},
  {name:"Siberian Nights",genre:"Electro",inst:{CH:[1,3,4,5,7,8,9,11,12,13,15,16],SN:[5,13],BD:[1,7]},tags:[]},
  {name:"New Wave",genre:"Electro",inst:{BD:[1,7,9,10],SN:[5,13],CH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],OH:[3],SH:[5,13]},tags:["complex"]},
  // ── HOUSE ──
  {name:"House",genre:"House",inst:{BD:[1,5,9,13],SN:[5,13],CY:[1],OH:[3,7,11,15]},tags:[]},
  {name:"House 2",genre:"House",inst:{BD:[1,5,9,13],SN:[5,13],CH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],OH:[3,6,11,14]},tags:[]},
  {name:"Brit House",genre:"House",inst:{BD:[1,5,9,13],CL:[5,13],CY:[3,7,11,15],CH:[1,2,4,5,6,8,9,10,12,13,14,16],OH:[3,7,11,15]},tags:["complex"]},
  {name:"French House",genre:"House",inst:{BD:[1,5,9,13],CL:[5,13],SH:[1,2,3,5,7,8,9,10,11,13,15,16],CH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],OH:[2,4,6,8,10,12,14,16]},tags:["complex"]},
  {name:"Dirty House",genre:"House",inst:{BD:[1,3,5,9,11,13,16],SN:[5,13],CL:[3,5,9,11,13],CH:[11,16],OH:[3,11,15]},tags:["heavy","complex"]},
  {name:"Deep House",genre:"House",inst:{BD:[1,5,9,13],CL:[5,13],CH:[2,8,10],OH:[3,7,11,15]},tags:["minimal"]},
  {name:"Deeper House",genre:"House",inst:{BD:[1,5,9,13],CL:[2,10],MT:[3,8,11],SH:[4,9],OH:[3,7,11,12,15]},tags:["complex"]},
  {name:"Slow Deep House",genre:"House",inst:{BD:[1,5,9,13],CL:[5,13],SH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],CH:[1,5,9,13],OH:[3,4,7,8,10,11,13]},tags:["complex"]},
  {name:"Footwork",genre:"House",sub:"A/B",inst:{BD:[1,4,7,9,12,15],CL:[13],CH:[3,11],RS:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},tags:["ab","complex","heavy"]},
  // ── MIAMI BASS ──
  {name:"Miami Bass",genre:"Miami Bass",sub:"A/B",inst:{BD:[1,7],SN:[5,13],CH:[1,3,4,5,7,8,9,11,12,13,15,16]},tags:["ab","heavy"]},
  {name:"Sally",genre:"Miami Bass",inst:{BD:[1,7,11,15],SN:[5,13],LT:[1,7,11,15],CH:[1,3,5,7,9,11,13,15]},tags:["heavy"]},
  {name:"Rock the Planet",genre:"Miami Bass",inst:{BD:[1,4,7],SN:[5,13],CH:[1,3,4,5,7,8,9,11,12,13,14,15,16]},tags:["heavy"]},
  // ── HIP-HOP ──
  {name:"Hip Hop 1",genre:"Hip-Hop",sub:"A/B",inst:{BD:[1,7,8,12,15],SN:[5,13]},tags:["ab"]},
  {name:"Hip Hop 2",genre:"Hip-Hop",sub:"A/B",inst:{BD:[1,8,9,10,14,16],SN:[5,13]},tags:["ab"]},
  {name:"Hip Hop 3",genre:"Hip-Hop",sub:"A/B",inst:{BD:[1,3,9,11],SN:[5,13]},tags:["ab"]},
  {name:"Hip Hop 4",genre:"Hip-Hop",sub:"A/B",inst:{BD:[1,4,8,10,11,16],SN:[5,13]},tags:["ab"]},
  {name:"Hip Hop 5",genre:"Hip-Hop",inst:{BD:[1,3,8,9,11,16],SN:[5,13]},tags:[]},
  {name:"Hip Hop 6",genre:"Hip-Hop",inst:{BD:[1,3,11,12,16],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:[]},
  {name:"Hip Hop 7",genre:"Hip-Hop",inst:{BD:[1,8,11,14,16],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:[]},
  {name:"Hip Hop 8",genre:"Hip-Hop",inst:{BD:[1,4,9,11,12],SN:[5,13],CH:[1,2,4,5,7,8,9,10,12,13,15,16],OH:[6,14]},tags:["complex"]},
  {name:"Trap",genre:"Hip-Hop",sub:"A/B",inst:{BD:[1,7,13],SN:[9],CH:[1,3,5,7,9,11,13,15]},tags:["ab","minimal"]},
  {name:"Planet Rock",genre:"Hip-Hop",sub:"A/B",inst:{CH:[1,3,4,5,7,8,9,11,12,13,14,15,16],CB:[1,3,5,7,8,10,12,13,15],SN:[5,13],BD:[1,7]},tags:["ab","complex"]},
  {name:"Inna Club",genre:"Hip-Hop",inst:{OH:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[3,8,11,16],HC:[5,13]},tags:[]},
  {name:"Ice",genre:"Hip-Hop",inst:{SN:[5,13],BD:[1,7,11,15],SH:[1,3,5,7,9,11,13,15]},tags:[]},
  {name:"Back to Cali",genre:"Hip-Hop",sub:"A/B",inst:{CH:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[1,7],HC:[5,7,9,13,15]},tags:["ab"]},
  {name:"Snoop Styles",genre:"Hip-Hop",inst:{RS:[3,6,9,12],OH:[1,4,7,11],SN:[5,13],BD:[1,4,7,11],HC:[5,13]},tags:["complex"]},
  {name:"The Groove",genre:"Hip-Hop",sub:"A/B",inst:{CH:[1,3,5,7,9,11,13,15],OH:[8],SN:[5,13],BD:[1,4,8,12,15],SH:[5,13]},tags:["ab","complex"]},
  {name:"Boom Bap",genre:"Hip-Hop",inst:{CB:[9],OH:[15],CH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],CL:[3,7,11,15],SN:[3,7,11,15],BD:[1,3,6,10,14]},tags:["complex","heavy"]},
  {name:"Most Wanted",genre:"Hip-Hop",sub:"A/B",inst:{CH:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[1,7,9,10,16],HC:[5,13]},tags:["ab"]},
  // ── FUNK AND SOUL ──
  {name:"Amen Break",genre:"Funk/Soul",sub:"A/B/C/D",inst:{BD:[1,3,11,12],SN:[5,8,10,13,16],CH:[1,3,5,7,9,11,13,15]},tags:["ab","heavy"]},
  {name:"The Funky Drummer",genre:"Funk/Soul",inst:{BD:[1,3,7,11,14],SN:[5,8,10,12,13,16],CH:[1,2,3,4,5,6,7,9,10,11,12,13,15,16],OH:[8,14]},tags:["complex","heavy"]},
  {name:"Impeach the President",genre:"Funk/Soul",inst:{BD:[1,8,9,15],SN:[5,13],CH:[1,3,5,7,8,9,13,15],OH:[11]},tags:[]},
  {name:"When the Levee Breaks",genre:"Funk/Soul",inst:{BD:[1,2,8,11,12],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:["heavy"]},
  {name:"It's a New Day",genre:"Funk/Soul",inst:{BD:[1,3,11,12,16],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:[]},
  {name:"The Big Beat",genre:"Funk/Soul",inst:{BD:[1,4,7,9],SN:[5,13],CH:[5,13]},tags:["minimal"]},
  {name:"Ashley's Roachclip",genre:"Funk/Soul",inst:{BD:[1,3,7,9,10],SN:[5,13],CH:[1,3,5,7,9,13,15],OH:[11],CB:[1,3,5,7,9,11,13,15]},tags:["complex"]},
  {name:"Papa Was Too",genre:"Funk/Soul",inst:{BD:[1,8,9,11,16],SN:[5,13],CH:[5,9,11,13,15,16],CY:[5]},tags:[]},
  {name:"Superstition",genre:"Funk/Soul",inst:{BD:[1,5,9,13],SN:[5,13],CH:[1,3,5,7,8,9,10,11,13,15,16]},tags:["heavy"]},
  {name:"Cissy Strut",genre:"Funk/Soul",sub:"A/B/C/D",inst:{BD:[1,4,6,10,12,13,15],SN:[5,8,10,11]},tags:["ab","complex"]},
  {name:"Hook and Sling",genre:"Funk/Soul",sub:"A/B/C/D",inst:{BD:[1,3,10,14,15],SN:[5,7,8,11,13],CY:[1,3,4,6,9,10,12,15]},tags:["ab","complex"]},
  {name:"Kissing My Love",genre:"Funk/Soul",sub:"A/B/C/D/E",inst:{CY:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],SN:[5,8,10,13],BD:[1,2,4,12,15]},tags:["ab","complex"]},
  {name:"Lady",genre:"Funk/Soul",sub:"A/B",inst:{CY:[3,7],SN:[5,6],BD:[1,9,12,15]},tags:["ab","minimal"]},
  {name:"Knocks Me Off My Feet",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,7,8,10,11,15],SN:[5,13],BD:[1,3,5,8,9,11,13,16]},tags:["ab","complex"]},
  {name:"The Thrill Is Gone",genre:"Funk/Soul",inst:{CY:[1,3,5,7,9,11,13,15],SN:[1,5,9,13],BD:[8,9,11]},tags:[]},
  {name:"Pop Tech",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,9],SN:[5,13],BD:[1]},tags:["ab","minimal"]},
  {name:"Ya Mama",genre:"Funk/Soul",sub:"A/B",inst:{CY:[5,13],BD:[1,9]},tags:["ab","minimal"]},
  {name:"Cold Sweat",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,8,15],BD:[1,9,11]},tags:["ab"]},
  {name:"I Got You (I Feel Good)",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[1,11]},tags:["ab","minimal"]},
  {name:"The Same Blood",genre:"Funk/Soul",inst:{CY:[1,3,5,7,8,9,11,12,13,15,16],SN:[4,6,7,13,14,15],BD:[1,2,9,10]},tags:["complex"]},
  {name:"Groove Me",genre:"Funk/Soul",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[1,4,5,8,9,10,12,14,16]},tags:["complex","heavy"]},
  {name:"Look-Ka Py Py",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[2,5,8,9,11,15],BD:[1,4,6,11,14,15]},tags:["ab","complex"]},
  {name:"Use Me",genre:"Funk/Soul",sub:"A/B/C/D",inst:{CY:[1,3,5,6,7,8,9,10,11,13,14,15,16],SN:[3,5,7,8,10,11,13,15,16],BD:[1,5,13]},tags:["ab","complex"]},
  {name:"Funky President",genre:"Funk/Soul",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[1,4,8,10,11]},tags:[]},
  {name:"Get Up",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,8,9,11,13,15,16],SN:[5,7,8,10,13,16],BD:[1,11,15]},tags:["ab","complex"]},
  {name:"Expensive Shit",genre:"Funk/Soul",inst:{CY:[1,3,4,5,7,8,9,11,12,13,15,16],SN:[1,2,4,6,9,10,13,14],BD:[4,7,15]},tags:["complex"]},
  {name:"Chug Chug Chug-a-Lug",genre:"Funk/Soul",inst:{CY:[1,3,5,6,7,9,10,11,13,15],SN:[2,3,5,8,10,11,13],BD:[1,4,6,8,10,12,15]},tags:["complex"]},
  {name:"The Fez",genre:"Funk/Soul",sub:"A/B",inst:{CY:[3,7,11,15],SN:[2,4,5,6,8,10,12,13,14,16],BD:[1,9]},tags:["ab","complex"]},
  {name:"Rock Steady",genre:"Funk/Soul",inst:{CY:[1,3,5,7,8,9,11,13,15,16],SN:[2,5,6,8,10,13,14,16],BD:[3,5,8,11,13]},tags:["complex"]},
  {name:"Synthetic Substitution",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,9],BD:[1,3,8,10,11,12,16]},tags:["ab"]},
  {name:"Cow'd Bell",genre:"Funk/Soul",sub:"A/B",inst:{CB:[1,3,4,5,7,8,9,11,12,13,15,16],SN:[2,4,5,6,8,10,12,13,14,16],BD:[1,4,7,8,11,12,14,16]},tags:["ab","complex"]},
  {name:"Palm Grease",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,2,3,4,6,7,9,11,12,14,15],SN:[5,8,10,13,16],BD:[1,9,16]},tags:["ab","complex"]},
  {name:"O-O-H Child",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,2,3,5,6,7,9,10,11,13,14,15],SN:[2,4,5,7,8,10,12,13,14,16],BD:[1,3,9,11,12]},tags:["ab","complex"]},
  {name:"Lady Marmalade",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[1,3,7,9,15]},tags:["ab"]},
  {name:"Hot Sweat",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,8,9,10,13,15,16],BD:[1,11]},tags:["ab","complex"]},
  {name:"Haitian Divorce",genre:"Funk/Soul",inst:{CY:[1,2,3,5,6,7,8,9,10,11,13,14,15,16],SN:[2,5,7,8,10,13,15,16],BD:[3,5,11,13]},tags:["complex"]},
  {name:"Come Dancing",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[2,3,5,6,7,10,11,13,14,15],BD:[1,8,9,16]},tags:["ab","complex"]},
  {name:"Respect Yourself",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,11,13],BD:[1,5,9,13]},tags:["ab"]},
  {name:"Express Yourself",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],SN:[5,8,10,12,14,16],BD:[1,4,9,12,15]},tags:["ab","complex"]},
  {name:"Let a Woman Be a Woman",genre:"Funk/Soul",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,8,10,11,13,14],BD:[3,9,11,12,14,15]},tags:["complex"]},
  {name:"Let a Man Be a Man",genre:"Funk/Soul",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,8,10,12,13],BD:[3,11,15]},tags:[]},
  {name:"Books of Moses",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[5,13],BD:[1,5,9,12]},tags:["ab"]},
  {name:"Mother Popcorn",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,5,9,13],SN:[5,8,10,15],BD:[1,3,11]},tags:["ab","complex"]},
  {name:"Strt Bts",genre:"Funk/Soul",sub:"A/B",inst:{CY:[2,3,5,6,8,9,14,15],SN:[2,5,8,12,13],BD:[1,4,7,11]},tags:["ab","complex"]},
  {name:"I Got the Feelin'",genre:"Funk/Soul",sub:"A/B",inst:{CY:[1,3,5,7,9,11,13,15],SN:[7,10,15],BD:[1,3,11]},tags:["ab"]},
  {name:"More Bounce to the Ounce",genre:"Funk/Soul",inst:{CH:[3,5,7,9,11,13,15],OH:[1],HC:[5,13],SN:[5,13],BD:[1,9,10]},tags:[]},
  // ── AFRO-CUBAN ──
  {name:"Son Clave",genre:"Afro-Cuban",inst:{BD:[1,4,5,8,9,12,13,16],RS:[1,4,7,11,13],CY:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},tags:["afro","complex"]},
  {name:"Rumba",genre:"Afro-Cuban",inst:{BD:[1,4,5,8,9,12,13,16],RS:[1,4,8,11,13],CY:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},tags:["afro","complex"]},
  {name:"Bossa Nova",genre:"Afro-Cuban",inst:{BD:[1,4,5,8,9,12,13,16],RS:[1,4,7,11,14],CY:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},tags:["afro","complex"]},
  {name:"Bouton",genre:"Afro-Cuban",inst:{BD:[1,9,11,15],RS:[4,7,13],CH:[1,3,4,5,7,9,11,13,15]},tags:["afro"]},
  {name:"Gahu",genre:"Afro-Cuban",inst:{BD:[1,5,9,13,15],RS:[3,4,7,8,11,12,15,16],CB:[1,4,7,11,15]},tags:["afro","complex"]},
  {name:"Shiko",genre:"Afro-Cuban",inst:{BD:[1,5,7,9,13,15],RS:[3,4,7,8,11,12,15,16],CB:[1,5,7,11,13]},tags:["afro","complex"]},
  {name:"Soukous",genre:"Afro-Cuban",inst:{BD:[1,5,9,13,15],RS:[1,4,7,9,12,15],CB:[1,4,7,10,11]},tags:["afro","complex"]},
  // ── DRUM AND BASS ──
  {name:"Drum and Bass 1",genre:"DnB",sub:"A/B",inst:{BD:[1,4,8,10,11,16],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:["ab","heavy"]},
  {name:"Drum and Bass 2",genre:"DnB",sub:"A/B",inst:{BD:[1,8,10,12,16],SN:[5,13],CH:[1,3,5,7,9,11,13,15]},tags:["ab","heavy"]},
  {name:"Drum and Bass 3",genre:"DnB",inst:{BD:[1,11],SN:[5,13],CH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],OH:[7,8,9,10]},tags:["heavy"]},
  {name:"Drum and Bass 4",genre:"DnB",sub:"A/B",inst:{BD:[1,7],SN:[5,11,13],CH:[1,3,5,7,9,11,13,15],OH:[1]},tags:["ab"]},
  {name:"Jungle",genre:"DnB",sub:"A/B",inst:{BD:[1,3,11],SN:[5,8,10,15],CH:[1,3,5,7,9,11,13,15]},tags:["ab","complex","heavy"]},
  // ── EDM ──
  {name:"Techno",genre:"EDM",inst:{BD:[1,5,9,13,15],SN:[5,13],CH:[10],OH:[3,7,11,15]},tags:[]},
  {name:"Dubstep",genre:"EDM",sub:"A/B",inst:{BD:[1,11],SN:[9],CH:[2,3,7,12,15],OH:[5,14]},tags:["ab"]},
  {name:"Dubstep Ratcheted",genre:"EDM",inst:{BD:[1,4,9,12],SN:[5,13,16],CH:[1,2,6,7,8,9,10,12,13,14,16],OH:[7]},tags:["complex"]},
  {name:"UK Garage",genre:"EDM",sub:"A/B",inst:{BD:[1,11],CL:[5,13],CH:[3,4,7,11,15,16],RS:[2,8,14],MT:[6,12]},tags:["ab","complex"]},
  {name:"Synth Wave",genre:"EDM",inst:{BD:[1,9],SN:[5,13],CH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],OH:[14]},tags:[]},
  // ── DUB ──
  {name:"Half Drop",genre:"Dub",inst:{BD:[1],SN:[9],CH:[1,3,5,7,9,11,13,15]},tags:["minimal"]},
  {name:"One Drop",genre:"Dub",inst:{BD:[9],SN:[9],CH:[1,3,5,7,9,11,13,15]},tags:["minimal"]},
  {name:"Two Drop",genre:"Dub",inst:{BD:[1,9],SN:[9],CH:[1,3,5,7,9,11,13,15]},tags:["minimal"]},
  {name:"Steppers",genre:"Dub",inst:{BD:[1,5,9,13],SN:[9],CH:[1,3,5,7,9,11,13,15]},tags:[]},
  // ── REGGAETON ──
  {name:"Reggaeton 1",genre:"Reggaeton",inst:{BD:[1,5,9,13],SN:[4,7,12,15],CH:[1,3,5,7,9,11,13,15]},tags:[]},
  {name:"Reggaeton 2",genre:"Reggaeton",inst:{CH:[3,7,11,15],SN:[4,6,7,8,11,12,15],BD:[1,8]},tags:[]},
  {name:"Reggaeton 3",genre:"Reggaeton",sub:"A/B",inst:{SN:[1,4,7,9,12,15],BD:[1,9]},tags:["ab","minimal"]},
  // ── POP ──
  {name:"Pop 1",genre:"Pop",inst:{CH:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],OH:[1,4,7,9,10],RS:[1,2,4,7,8,11,12],SN:[5,13],BD:[1,2,4,8,11],HC:[5,13]},tags:["complex"]},
  {name:"In the Air Last Night",genre:"Pop",sub:"A/B",inst:{HT:[3,7],OH:[1,13],CH:[3,7,11,13],SN:[13],BD:[11]},tags:["ab","minimal"]},
  {name:"Bleu Monday",genre:"Pop",sub:"A/B",inst:{OH:[3,7,11,15],SN:[5,13],BD:[1,9],HC:[5,13]},tags:["ab"]},
  {name:"Nineteen",genre:"Pop",sub:"A/B",inst:{CH:[1,4,7,9,10],OH:[1,4,7,9,10],RS:[1,2,4,7,8,11,12],BD:[1,2,4,8,11],HC:[5,13]},tags:["ab","complex"]},
  // ── DRUM ROLLS ──
  {name:"Drum Roll 1",genre:"Rolls",inst:{HT:[9,10,11],MT:[12,13,14],LT:[15,16],OH:[1],CY:[1]},tags:[]},
  {name:"Drum Roll 2",genre:"Rolls",inst:{BD:[13,15],SN:[1,3,4,5,7,9,10,11,12]},tags:["heavy"]},
  {name:"Drum Roll 3",genre:"Rolls",inst:{SN:[1,2,3,5,6,7,9,11,13,14,15,16]},tags:["heavy"]},
  {name:"Drum Roll 4",genre:"Rolls",inst:{BD:[1,7,13],SN:[4,5,8,9,16],CY:[1,7,13]},tags:[]},
  {name:"Drum Roll 5",genre:"Rolls",inst:{HT:[1],MT:[5,9,11],LT:[13,15]},tags:[]},
  {name:"Drum Roll 6",genre:"Rolls",inst:{HT:[1],MT:[5,9,11],LT:[13,15]},tags:[]},
  {name:"Drum Roll 7",genre:"Rolls",inst:{HT:[3],MT:[4,7,8],LT:[11,12,14],SN:[1,5,9,13]},tags:["complex"]},
  {name:"Drum Roll 8",genre:"Rolls",inst:{HT:[3],MT:[5,9,11,12],LT:[15,16],SN:[1,8,13]},tags:["complex"]},
  {name:"Drum Roll 9",genre:"Rolls",inst:{HT:[3],MT:[5,11],LT:[13,15],SN:[1,2,7,9,10]},tags:["complex"]},
  {name:"Drum Roll 10",genre:"Rolls",inst:{HT:[3,4],MT:[7,8,11,12],LT:[15,16],SN:[1,2,5,6,9,10,13,14]},tags:["complex","heavy"]},
  {name:"Drum Roll 11",genre:"Rolls",inst:{HT:[2,14],MT:[5,8],LT:[11,15,16],SN:[1,4,7,10,13],BD:[3,6,9,12]},tags:["complex"]},
  {name:"Drum Roll 12",genre:"Rolls",inst:{HT:[3,10],MT:[11,13],LT:[12,14,15],SN:[1,2,9,13],BD:[5,7],CY:[5,7]},tags:["complex"]},
  {name:"Drum Roll 13",genre:"Rolls",inst:{HT:[2],MT:[6,10],LT:[14],SN:[1,5,9,13],BD:[3,4,7,8,11,12,15,16]},tags:["complex"]},
  {name:"Drum Roll 14",genre:"Rolls",inst:{HT:[10,11,12,13],MT:[4,5,6,7,8,9,14,15],LT:[1,2,3,16]},tags:["complex"]},
  {name:"Drum Roll 15",genre:"Rolls",inst:{HT:[2,10],LT:[4,8,12,16],SN:[1,5,9,13]},tags:["complex"]},
  {name:"Drum Roll 16",genre:"Rolls",inst:{SN:[1,2,7,8,13,14],BD:[3,5,11,15],CH:[3,9,15],CY:[5,11]},tags:[]},
  {name:"Drum Roll 17",genre:"Rolls",inst:{HT:[3,4],MT:[9,10],SN:[1,2,5,7,8,11,13,14,15,16],CY:[5,11]},tags:["complex"]},
  {name:"Drum Roll 18",genre:"Rolls",inst:{SN:[1,7],BD:[3,5,9,11,15],CY:[1,7,13]},tags:[]},
  {name:"Drum Roll 19",genre:"Rolls",inst:{SN:[1,2,7,8,13,14],BD:[3,5,9,11,15],CY:[3,5,9,11,15]},tags:["complex"]},
  {name:"Drum Roll 20",genre:"Rolls",inst:{HT:[3,5],MT:[7,15],LT:[16],SN:[1,9,11,14],BD:[2,4,6,8,10,12,13],CY:[9]},tags:["complex"]},
];

/* General MIDI, канал 10. Ключи — обозначения из сборника. */
window.DRUM_MIDI_NOTE = {
  BD: 36, SN: 38, CH: 42, OH: 46, CL: 39, HC: 39,
  CY: 49, CB: 56, RS: 37, SH: 70, HT: 50, MT: 47, LT: 41, AC: 44
};

/**
 * Один такт паттерна → MIDI-файл формата 0. Конец дорожки ровно через такт,
 * чтобы регион в DAW был длиной в такт и зацикливался без дыры.
 * События сортируются по абсолютному времени, дельты считаются между
 * соседними событиями: одновременные удары дают дельту 0, а не отрицательную.
 */
window.drumPatternToMidi = function (pattern, bpm) {
  var PPQ = 96, STEP = PPQ / 4, LEN = STEP / 2, BAR = STEP * 16, CH = 9;
  var events = [];
  Object.keys(pattern.inst).forEach(function (abbr) {
    var note = window.DRUM_MIDI_NOTE[abbr.toUpperCase()] || 38;
    var vel = abbr === "AC" ? 110 : 90;
    pattern.inst[abbr].forEach(function (step) {
      var tick = (step - 1) * STEP;
      events.push({ tick: tick, bytes: [0x90 | CH, note, vel], off: 0 });
      events.push({ tick: tick + LEN, bytes: [0x80 | CH, note, 0], off: 1 });
    });
  });
  // на одном тике «отпускание» раньше нового удара
  events.sort(function (a, b) { return a.tick - b.tick || b.off - a.off; });

  function varLen(n) {
    var out = [n & 0x7f];
    while ((n >>= 7)) out.unshift((n & 0x7f) | 0x80);
    return out;
  }
  function u32(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]; }

  var tempo = Math.round(60000000 / bpm);
  var track = [0, 0xff, 0x51, 3, (tempo >> 16) & 255, (tempo >> 8) & 255, tempo & 255,
               0, 0xff, 0x58, 4, 4, 2, 24, 8];
  var prev = 0;
  events.forEach(function (ev) {
    track.push.apply(track, varLen(ev.tick - prev).concat(ev.bytes));
    prev = ev.tick;
  });
  track.push.apply(track, varLen(BAR - prev).concat([0xff, 0x2f, 0]));

  var head = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0, PPQ];
  return new Uint8Array(head.concat([0x4d, 0x54, 0x72, 0x6b], u32(track.length), track));
};
