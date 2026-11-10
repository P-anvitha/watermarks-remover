// Grad9 Australia Feb 2027 intake roadmap. node feb.js <outdir>
const {chromium}=require('playwright');const fs=require('fs');
const out=process.argv[2]||__dirname;const photo=process.argv[3];const POS=process.env.POS||'50% 50%';const PH='data:image/jpeg;base64,'+fs.readFileSync(photo).toString('base64');
const logo='data:image/jpeg;base64,'+fs.readFileSync(__dirname+'/logo.jpeg').toString('base64');
const S=[
 ['NOW','NOV','Shortlist & apply','IELTS/PTE + apply to 3–5 unis','📝'],
 ['NOV–DEC','DEC','Offer letter','Accept + pay deposit & OSHC','🎓'],
 ['DEC','DEC','Get your CoE','GS answers + funds proof*','💰'],
 ['DEC–JAN','JAN','Student visa (500)','Apply online + biometrics','🛂'],
 ['JAN 2027','JAN','Visa grant','Book flights + stay','🏠'],
 ['FEB 2027','FEB','Fly to Australia','Orientation + classes start','✈️'],
];
function star(cx,cy,R,n=7,ri=0.42){let p=[];for(let i=0;i<n*2;i++){const r=i%2?R*ri:R;const a=-Math.PI/2+i*Math.PI/n;p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1))}return `<polygon points="${p.join(' ')}" fill="#fff"/>`}
function flagMap(m,x0,y0){const {d,W,H}=m;const s=W/430;
 const jack=`<svg x="0" y="0" width="${W*0.5}" height="${H*0.40}" viewBox="0 0 60 30" preserveAspectRatio="none"><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#E4002B" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#E4002B" stroke-width="6"/></svg>`;
 const stars=star(W*0.25,H*0.66,30*s)+star(W*0.70,H*0.80,17*s)+star(W*0.58,H*0.50,17*s)+star(W*0.70,H*0.20,17*s)+star(W*0.81,H*0.42,17*s)+star(W*0.75,H*0.58,8*s,5,0.45);
 return `<svg class="map" style="left:${x0}px;top:${y0}px" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><clipPath id="au"><path d="${d}"/></clipPath><filter id="sh" x="-20%" y="-20%" width="150%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0B2A5B" flood-opacity=".22"/></filter></defs><path d="${d}" fill="#012169" filter="url(#sh)"/><g clip-path="url(#au)"><rect width="${W}" height="${H}" fill="#012169"/>${jack}${stars}</g><path d="${d}" fill="none" stroke="#fff" stroke-width="${4*s}" stroke-linejoin="round"/></svg>`}
function html(H,C){const sq=H===1080;const k=sq?0.8:1;const px=v=>Math.round(v*k)+'px';
 const m=JSON.parse(fs.readFileSync(__dirname+(sq?'/aus-s1080.json':'/aus-s1350.json')));
 const y0=sq?400:505,dy=sq?103:132,xs=[505,575];
 const pts=S.map((s,i)=>[xs[i%2],y0+i*dy]);const L=pts.length-1;
 let d=`M ${pts[0][0]} ${y0-(sq?50:70)} L ${pts[0][0]} ${pts[0][1]}`;
 for(let i=1;i<pts.length;i++){const [a,b]=pts[i-1],[c,e]=pts[i];d+=` C ${a} ${b+dy*.5} ${c} ${e-dy*.5} ${c} ${e}`}
 const pins=pts.map(([x,y],i)=>{const last=i===L;const r=(last?50:42)*k;return `<circle cx="${x}" cy="${y}" r="${r+7*k}" fill="#fff"/><circle cx="${x}" cy="${y}" r="${r}" fill="${last?C.acc:C.pin}"/><text x="${x}" y="${y+12*k}" text-anchor="middle" font-size="${(last?40:34)*k}" font-weight="800" letter-spacing=".04em" fill="${last?C.ink:'#fff'}">${last?'✈':i+1}</text>`}).join('');
 const cards=pts.map(([x,y],i)=>{const left=i%2===0;const last=i===L;const st=left?`right:${1080-x+66*k}px`:`left:${x+66*k}px`;
  return `<div class="cd${last?' last':''}${left?' l':''}" style="top:${y}px;${st}"><div class="ic">${S[i][4]}</div><div><i>${S[i][0]}</i><b>${S[i][2]}</b><span>${S[i][3]}</span></div></div>`}).join('');
 return `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=block" rel="stylesheet"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:${H}px;overflow:hidden;font-family:'Plus Jakarta Sans',sans-serif;background:#0B2A5B url(${PH}) ${POS}/cover no-repeat;color:${C.text};position:relative}
.ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,28,64,.80) 0%,rgba(8,28,64,.45) 24%,rgba(8,28,64,.18) 40%,rgba(8,28,64,.30) 60%,rgba(8,28,64,.72) 100%)}
svg{position:absolute;left:0;top:0;overflow:visible;font-family:'Plus Jakarta Sans'}
.wm{position:absolute;right:${px(-20)};bottom:${px(150)};font-weight:800;font-size:${px(330)};letter-spacing:-.05em;color:${C.wm};line-height:1}
.logo{position:absolute;top:${px(52)};right:60px;width:${px(176)};height:${px(92)};background:#fff;border-radius:16px;box-shadow:0 6px 18px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;z-index:3}.logo img{width:84%}
.head{position:absolute;color:#fff;left:60px;top:${px(52)};width:${px(720)}}
.k{display:inline-flex;gap:10px;align-items:center;font-weight:800;font-size:${px(22)};letter-spacing:.12em;background:rgba(255,255,255,.18);border:2px solid rgba(255,255,255,.55);color:#fff;padding:${px(8)} ${px(20)};border-radius:999px}
h1{font-weight:800;font-size:${px(96)};line-height:.98;letter-spacing:-.035em;margin-top:${px(20)}}
h1 small{display:block;font-size:${px(50)};letter-spacing:-.02em;margin-top:${px(6)}}
h1 u{text-decoration:none;color:${C.acc}}
h1{text-shadow:0 4px 18px rgba(0,0,0,.25)}
.urg{display:inline-flex;align-items:center;gap:${px(14)};margin-top:${px(26)};background:${C.acc};color:${C.ink};border-radius:${px(18)};padding:${px(12)} ${px(14)} ${px(12)} ${px(22)};font-weight:800;font-size:${px(34)};letter-spacing:-.01em;transform:rotate(-2deg);box-shadow:0 0 0 ${px(6)} rgba(242,179,61,.35),0 12px 30px rgba(0,0,0,.30)}
.urg em{font-style:normal;background:${C.ink};color:#fff;border-radius:${px(12)};padding:${px(6)} ${px(14)};font-size:${px(24)};letter-spacing:.06em}
.cd{position:absolute;transform:translateY(-50%);width:${px(388)};background:#fff;border-radius:${px(20)};padding:${px(16)} ${px(20)};display:flex;gap:${px(14)};align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.25);z-index:2}
.cd.l{flex-direction:row-reverse;text-align:right}
.cd .ic{flex:none;width:${px(56)};height:${px(56)};border-radius:${px(16)};background:${C.soft};display:flex;align-items:center;justify-content:center;font-size:${px(30)}}
.cd i{display:block;font-style:normal;font-weight:800;font-size:${px(16)};letter-spacing:.14em;color:${C.sub}}
.cd b{display:block;font-weight:800;font-size:${px(29)};letter-spacing:-.01em;line-height:1.12}
.cd span{display:block;font-weight:500;font-size:${px(19)};color:${C.sub};margin-top:3px;line-height:1.3}
.cd.last{background:${C.pin};border:3px solid ${C.acc};color:#fff}.cd.last span,.cd.last i{color:rgba(255,255,255,.75)}.cd.last .ic{background:${C.acc}}
.ph{position:absolute;left:60px;right:60px;bottom:${px(44)};display:flex;align-items:center;justify-content:space-between}
.ph b{border:3px solid #fff;background:${C.pin};color:#fff;font-weight:800;font-size:${px(38)};padding:${px(9)} ${px(28)};border-radius:999px}
.ph span{font-weight:600;font-size:${px(17)};color:rgba(255,255,255,.9);text-shadow:0 1px 4px rgba(0,0,0,.4);text-align:right;line-height:1.4}
</style></head><body>
<div class="ov"></div>

${process.env.MAP?flagMap(m,sq?790:720,sq?140:170):''}
<svg width="1080" height="${H}"><path d="${d}" fill="none" stroke="rgba(255,255,255,.30)" stroke-width="${84*k}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="${4*k}" stroke-dasharray="${18*k} ${16*k}"/>${pins}</svg>
<div class="logo"><img src="${logo}"></div>
<div class="head"><div class="k">🇦🇺 FEB 2027 INTAKE</div><h1>Australia<small>your <u>roadmap</u> starts now</small></h1><div class="urg">⏳ Only 3 months left! <em>SAVE THIS 🔖</em></div></div>
${cards}
<div class="ph"><b>📞 91331 50666</b><span>*Funds: AUD 29,710/yr living cost + fees + travel.<br>Dates vary by university; rules as of Nov 2026.</span></div>
</body></html>`}
const CS={
 ocean:{grad:'linear-gradient(180deg,#E6F1FB 0%,#F5F9FE 100%)',road:'#C7DCF2',acc:'#F2B33D',ink:'#0B2A5B',sub:'#56688A',text:'#0B2A5B',pin:'#0B2A5B',soft:'#EAF2FB',wm:'rgba(11,42,91,.05)'},
 sand:{grad:'linear-gradient(180deg,#FAEFDD 0%,#FFF8EE 100%)',road:'#EFD9B6',acc:'#F2B33D',ink:'#0B2A5B',sub:'#6E6457',text:'#0B2A5B',pin:'#0B2A5B',soft:'#FBF1E2',wm:'rgba(11,42,91,.05)'}};
(async()=>{const b=await chromium.launch();for(const t of ['ocean'])for(const H of [1350,1080]){const p=await b.newPage({viewport:{width:1080,height:H}});await p.setContent(html(H,CS[t]),{waitUntil:"networkidle"});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`${out}/grad9-australia-feb2027-photo-1080x${H}.png`});}await b.close()})();
