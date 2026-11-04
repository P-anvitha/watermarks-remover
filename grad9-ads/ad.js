// Grad9 ad flier with a real photo background.
// usage: node ad.js <germany|uk> <photo.jpg> <outdir> [focusX%]
// Writes <country>-1080x1350.html and <country>-1080x1080.html; screenshot each with headless Chrome at that size.
const fs = require('fs');
const path = require('path');
const [country, photo, outDir = '.', focus = '70%'] = process.argv.slice(2);
const logo = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'logo.jpeg')).toString('base64');
const ext = path.extname(photo).slice(1).toLowerCase().replace('jpg', 'jpeg');
const bg = `data:image/${ext};base64,` + fs.readFileSync(photo).toString('base64');

const RED = '#E8232B';

const ICON = {
  work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5h6v2"/><path d="M3 12.5h18"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 9v6"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 9h15"/><path d="M16 13.5h5v-3h-5a1.5 1.5 0 0 0 0 3z"/><path d="M6 6l9-3 1 3"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/><path d="M8 10.5h5M10.5 8v5"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 15.5h6M9 9h3"/></svg>',
  bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 9l9-5 9 5z"/><path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8"/><path d="M3 20h18"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M10 13L3 10l1.5-1.5 8 1L17 5c1-1 2.6-1 3 0s0 2-1 3l-4.5 4.5 1 8L14 22l-3-7-3.5 3.5V21l-1.5 1-1-3.5-3.5-1L3 16h2.5z"/></svg>',
};

const FLAGS = {
  germany: '<span class="flag"><i style="background:#111"></i><i style="background:#DD0000"></i><i style="background:#FFCE00"></i></span>',
  uk: '<span class="flag uk"><svg viewBox="0 0 60 30" preserveAspectRatio="none"><clipPath id="t"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><path d="M0,0v30h60v-30z" fill="#012169"/><path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30M60,0 0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg></span>',
};

const C = {
  germany: {
    small: "Master's in", big: 'Germany', tag: 'World-class degrees. <span>Low tuition.</span>', pill: 'Plan your 2027 intake now',
    cards: [
      ['cap', 'Tuition at public universities', 'Mostly free<small>*</small>'],
      ['wallet', 'Blocked account (living costs)', '€11,904 <small>per year*</small>'],
      ['cal', 'Intakes', 'April &amp; October'],
    ],
    feats: [['search', 'Course<br>Shortlisting'], ['doc', 'SOP &amp;<br>Applications'], ['bank', 'Blocked Account<br>Help'], ['plane', 'Visa<br>Guidance']],
    note: '*Most public universities charge only a semester fee; some states charge tuition. Figures are indicative.',
  },
  uk: {
    small: "1-year Master's in", big: 'The UK', tag: 'Finish faster. <span>Work sooner.</span>', pill: 'Plan your 2027 intake now',
    cards: [
      ['cap', 'Course length', '1 year <small>for most Master\'s</small>'],
      ['work', 'Post-study work (Graduate Route)', '18 months<small>*</small>'],
      ['cal', 'Intakes', 'Jan &amp; Sept'],
    ],
    feats: [['search', 'University<br>Shortlisting'], ['doc', 'SOP &amp;<br>Applications'], ['bank', 'Scholarship<br>Guidance'], ['plane', 'Visa<br>Guidance']],
    note: '*Graduate Route length for students applying from January 2027. Rules can change; check with Grad9.',
  },
}[country];

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:var(--w);height:var(--h);overflow:hidden;font-family:Manrope,sans-serif;-webkit-font-smoothing:antialiased;color:#111216}
.ad{position:relative;width:var(--w);height:var(--h);overflow:hidden;background:#EEF2F6 center/cover no-repeat}
.scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.93) 0%,rgba(255,255,255,.82) 38%,rgba(255,255,255,.25) 62%,rgba(255,255,255,0) 78%),linear-gradient(180deg,rgba(255,255,255,0) 60%,rgba(255,255,255,.55) 100%)}
.flag.uk svg{width:100%;height:100%;display:block}
.top{position:absolute;left:64px;right:56px;top:56px;display:flex;justify-content:space-between;align-items:flex-start}
.eyebrow{display:flex;align-items:center;gap:16px;font-weight:800;font-size:26px;letter-spacing:.2em;color:#2B2E35;margin-top:22px}
.flag{display:inline-flex;flex-direction:column;width:46px;height:30px;border-radius:3px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.08)}
.flag i{flex:1}
.logo{width:236px;height:122px;background:#fff;border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(30,40,60,.12)}
.logo img{width:196px}
.head{position:absolute;left:64px;top:var(--headT)}
.h-sm{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:var(--hs);line-height:1;text-transform:uppercase;color:#2B2E35;letter-spacing:.01em}
.h-xl{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:var(--hx);line-height:.9;text-transform:uppercase;letter-spacing:-.005em;color:#111216}
.tag{font-weight:800;font-size:var(--tg);margin-top:14px;color:#1B1D22}
.tag span{color:${RED}}
.pill{display:inline-block;margin-top:20px;background:${RED};color:#fff;font-weight:800;font-size:var(--pl);padding:10px 22px;border-radius:10px;letter-spacing:.01em}
.cards{position:absolute;left:64px;top:var(--cardsT);width:var(--cW);display:flex;flex-direction:column;gap:var(--cG)}
.card{display:flex;align-items:center;gap:22px;background:rgba(255,255,255,.94);border-radius:22px;padding:var(--cP);box-shadow:0 12px 30px rgba(30,40,60,.10)}
.ic{flex:none;width:var(--icS);height:var(--icS);border-radius:50%;display:flex;align-items:center;justify-content:center;background:#FDECEC;color:${RED}}
.ic svg{width:58%;height:58%}
.sep{width:2px;align-self:stretch;background:#ECEDEF;margin:6px 0}
.card .k{font-weight:700;font-size:var(--kS);color:#5A5E66}
.card .v{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:var(--vS);line-height:1.02;color:#111216}
.card .v small{font-family:Manrope;font-weight:700;font-size:var(--kS);color:#5A5E66;margin-left:6px}
.feats{position:absolute;left:64px;right:64px;top:var(--fT);display:flex;background:rgba(255,255,255,.94);border-radius:22px;padding:var(--fP,22px 10px);box-shadow:0 12px 30px rgba(30,40,60,.10)}
.feat{flex:1;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;font-weight:800;font-size:var(--fS);line-height:1.2;color:#2B2E35}
.feat+.feat{border-left:2px solid #ECEDEF}
.feat .fi{width:var(--fiS);height:var(--fiS);border-radius:16px;background:#111216;color:#fff;display:flex;align-items:center;justify-content:center}
.feat .fi svg{width:56%;height:56%}
.cta{position:absolute;left:64px;right:64px;top:var(--ctaT);display:flex;align-items:center;gap:22px}
.btn{display:flex;align-items:center;gap:18px;background:${RED};color:#fff;border-radius:999px;padding:var(--bP);font-weight:800;font-size:var(--bS);box-shadow:0 14px 30px rgba(232,35,43,.35)}
.btn b{font-size:1.2em;line-height:1}
.call{display:flex;flex-direction:column;background:#fff;border-radius:20px;padding:12px 26px;box-shadow:0 12px 30px rgba(30,40,60,.10)}
.call .cl{font-weight:800;font-size:18px;letter-spacing:.18em;color:#5A5E66}
.call .ph{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:var(--phS);line-height:1;color:#111216}
.note{position:absolute;left:64px;right:64px;bottom:var(--nB);font-weight:700;font-size:17px;color:#2B2E35;text-shadow:0 0 8px rgba(255,255,255,.9)}
.bar{position:absolute;left:0;right:0;bottom:0;height:12px;background:${RED}}
`;

const SIZES = {
  portrait: { w: 1080, h: 1350, vars: {
    '--skyB': '360px', '--gR': '-6px', '--gB': '396px', '--gW': '470px', '--groundH': '400px',
    '--headT': '188px', '--hs': '56px', '--hx': '176px', '--tg': '36px', '--pl': '27px',
    '--cardsT': '560px', '--cW': '560px', '--cG': '14px', '--cP': '16px 26px 16px 16px', '--icS': '80px', '--kS': '22px', '--vS': '52px',
    '--fT': '940px', '--fS': '21px', '--fiS': '62px',
    '--ctaT': '1140px', '--bP': '24px 40px', '--bS': '34px', '--phS': '46px', '--nB': '32px' } },
  square: { w: 1080, h: 1080, vars: {
    '--skyB': '330px', '--gR': '-6px', '--gB': '352px', '--gW': '430px', '--groundH': '360px',
    '--headT': '156px', '--hs': '42px', '--hx': '128px', '--tg': '27px', '--pl': '22px',
    '--cardsT': '442px', '--cW': '540px', '--cG': '10px', '--cP': '11px 22px 11px 12px', '--icS': '60px', '--kS': '18px', '--vS': '40px',
    '--fT': '730px', '--fS': '17px', '--fP': '16px 8px', '--fiS': '46px',
    '--ctaT': '882px', '--bP': '18px 32px', '--bS': '28px', '--phS': '38px', '--nB': '24px' } },
};

function html(size) {
  const s = SIZES[size];
  const vars = Object.entries({ '--w': s.w + 'px', '--h': s.h + 'px', ...s.vars }).map(([k, v]) => `${k}:${v}`).join(';');
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Manrope:wght@600;700;800&display=block" rel="stylesheet">
<style>:root{${vars}}${CSS}</style></head><body><div class="ad" style="background-image:url(${bg});background-position:${focus} center">
 <div class="scrim"></div>
 <div class="top"><div class="eyebrow">${FLAGS[country]}STUDY ABROAD 2027</div><div class="logo"><img src="${logo}"></div></div>
 <div class="head">
   <div class="h-sm">${C.small}</div>
   <div class="h-xl">${C.big}</div>
   <div class="tag">${C.tag}</div>
   <div class="pill">${C.pill}</div>
 </div>
 <div class="cards">${C.cards.map(([i, k, v]) => `<div class="card"><div class="ic">${ICON[i]}</div><div class="sep"></div><div><div class="k">${k}</div><div class="v">${v}</div></div></div>`).join('')}</div>
 <div class="feats">${C.feats.map(([i, t]) => `<div class="feat"><div class="fi">${ICON[i]}</div>${t}</div>`).join('')}</div>
 <div class="cta">
   <div class="btn">Check Your Eligibility <b>&rarr;</b></div>
   <div class="call"><div class="cl">CALL GRAD9</div><div class="ph">91331 50666</div></div>
 </div>
 <div class="note">${C.note}</div>
 <div class="bar"></div>
</div></body></html>`;
}

fs.mkdirSync(outDir, { recursive: true });
for (const size of Object.keys(SIZES)) {
  const { w, h } = SIZES[size];
  fs.writeFileSync(path.join(outDir, `${country}-${w}x${h}.html`), html(size));
}
