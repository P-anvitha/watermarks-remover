// Grad9 "Our services" carousel, photo edition (5 slides, 1080x1350).
// Same copy and layout as services.js, but the sketch stickers are replaced by
// real photos of students in rounded white-bordered cards (no cut-outs).
// usage: node services-photo.js <photodir> <outdir>
//   <photodir> must hold 1.jpg ... 5.jpg (one photo per slide, see PHOTOS below).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const photoDir = process.argv[2];
const outDir = process.argv[3];
if (!photoDir || !outDir) { console.error('usage: node services-photo.js <photodir> <outdir>'); process.exit(1); }
const logo = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(__dirname, 'logo.jpeg')).toString('base64');
const BASE = fs.readFileSync(path.join(__dirname, 'build.js'), 'utf8').match(/const CSS = `([\s\S]*?)`;/)[1];
const photo = n => {
  const f = ['jpg', 'jpeg', 'png', 'webp'].map(e => path.join(photoDir, `${n}.${e}`)).find(fs.existsSync);
  if (!f) throw new Error(`missing photo ${n}.jpg in ${photoDir}`);
  const ext = path.extname(f).slice(1).replace('jpg', 'jpeg');
  return `data:image/${ext};base64,` + fs.readFileSync(f).toString('base64');
};

const CSS = BASE + `
.top,.mid,.foot{position:relative;z-index:1}
.grid{position:absolute;inset:0;z-index:0}
h1.md{font-size:124px;line-height:.98}
.tag{display:inline-block;align-self:flex-start;background:#0A0A0A;color:#fff;font-weight:800;font-size:24px;letter-spacing:.16em;text-transform:uppercase;padding:12px 20px;border-radius:10px;margin-bottom:34px}
p.body b{color:#E8232B;font-weight:800}
.red p.body b{color:#fff}
.circ{position:relative;display:inline-block}
.circ svg{position:absolute;left:-12%;top:-16%;width:124%;height:130%;overflow:visible}
.rows.compact .row{min-height:100px}.rows.compact{gap:14px}
.side{display:flex;align-items:center;justify-content:space-between;gap:30px}
/* Photo card: full rectangular photo, white border, soft shadow, slight tilt. */
.pic{position:relative;border:12px solid #fff;border-radius:28px;background:#fff;box-shadow:0 18px 40px rgba(0,0,0,.18),0 0 0 2px #E6E7EA;overflow:hidden;flex-shrink:0}
.pic img{display:block;width:100%;height:100%;object-fit:cover;border-radius:16px}
.pic::after{content:'';position:absolute;left:0;bottom:0;width:120px;height:10px;background:#E8232B;border-radius:0 6px 0 16px}
.art{margin-top:40px}
.art .pic{transform:rotate(-1.2deg)}
.side .pic{transform:rotate(2deg);margin-right:-10px}
/* CTA slide on Grad9 red instead of black. */
.s.red{background:#E8232B;color:#fff}
.red .label,.red .count{color:#fff}.red .label i{background:#fff}.red .count b{color:#fff}
.red h1 em{background:#fff;color:#E8232B}
.red p.body{color:#fff}
.red .bar{background:#0A0A0A}
.red .logo{border-color:#fff}
.red .pic::after{background:#0A0A0A}
.red .art{margin:0 0 36px}
.red .label{margin-bottom:30px}.red .call{margin-top:30px}
`;

const R = '#E8232B';
function grid(red) {
  const c = red ? 'rgba(255,255,255,.12)' : 'rgba(232,35,43,.11)';
  let d = '';
  for (let x = -20; x <= 1100; x += 64) {
    d += `M${x} 0`;
    for (let y = 0; y <= 1350; y += 45) d += ` L${(x + 22 * Math.sin(y / 260 + x / 300)).toFixed(1)} ${y}`;
  }
  for (let y = -20; y <= 1370; y += 64) {
    d += `M0 ${y}`;
    for (let x = 0; x <= 1080; x += 45) d += ` L${x} ${(y + 22 * Math.sin(x / 240 + y / 330)).toFixed(1)}`;
  }
  return `<svg class="grid" viewBox="0 0 1080 1350"><path d="${d}" fill="none" stroke="${c}" stroke-width="2"/></svg>`;
}
const circ = (w, col = R) => `<span class="circ">${w}<svg viewBox="0 0 200 100" preserveAspectRatio="none"><path d="M34 16 C90 0 188 8 194 50 C198 92 88 100 28 86 C-6 76 4 20 78 8" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg></span>`;
const PHONE = '<svg width="44" height="44" viewBox="0 0 24 24"><path fill="#E8232B" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>';

// w/h: card size in px, pos: object-position to keep faces in frame.
const pic = (n, w, h, pos = '50% 35%') => `<div class="pic" style="width:${w}px;height:${h}px"><img src="${photo(n)}" style="object-position:${pos}"></div>`;
const POS = (process.env.POS || '').split(',');  // optional per-photo focus override, e.g. POS="50% 30%,,40% 20%"
const p = (n, w, h, def) => pic(n, w, h, POS[n - 1] || def);

const slides = () => [
  { label: 'Our services', title: `No ${circ('two')} students<br>need the <em>same</em><br>support`,
    body: 'So Grad9 helps you where you need it most.', art: p(1, 920, 430) },
  { tag: 'University shortlisting', title: `Pick the<br>${circ('right')} <em>university</em>`,
    body: 'Every shortlist is built around <b>your career goals</b>, your profile and your budget. Not guesswork.', art: p(2, 920, 470) },
  { tag: 'SOP &amp; resume support', title: `Go <em>beyond</em><br>${circ('grades')} and<br>marks`,
    body: 'We help you write SOPs, essays and resumes that show <b>who you are</b> and why you belong on the course.', art: p(3, 920, 330) },
  { tag: 'End-to-end support', title: `We see<br>the <em>bigger</em><br>${circ('picture')}`, side: p(4, 330, 380),
    rows: [{ red: true, num: '01', t: 'University selection' }, { num: '02', t: 'Applications &amp; SOP' }, { num: '03', t: 'Education loans' }, { num: '04', t: 'Visa support' }] },
  { red: true, label: 'Wherever you are today', title: 'We\'ll meet you<br>where you <em>are</em>', top: p(5, 920, 290),
    body: 'Choosing universities, polishing your application or planning the whole journey. Talk to Grad9 today.', call: true },
];

function slideHtml(s, i, n) {
  const pad = x => String(x).padStart(2, '0');
  let mid = '';
  if (s.top) mid += `<div class="art">${s.top}</div>`;
  if (s.tag) mid += `<div class="tag">${s.tag}</div>`;
  else mid += `<div class="label"><i></i>${s.label}</div>`;
  const h1 = `<h1 class="md">${s.title}</h1>`;
  mid += s.side ? `<div class="side">${h1}${s.side}</div>` : h1;
  if (s.body) mid += `<p class="body">${s.body}</p>`;
  if (s.rows) mid += `<div class="rows compact">${s.rows.map(r =>
    `<div class="row ${r.red ? 'red' : ''}"><div class="n">${r.num}</div><div class="t">${r.t}</div></div>`).join('')}</div>`;
  if (s.call) mid += `<div><div class="call">${PHONE}<div><div class="cl">CALL GRAD9</div><div class="ph">91331 50666</div></div></div></div>`;
  if (s.art) mid += `<div class="art">${s.art}</div>`;
  const last = i === n;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Manrope:wght@500;600;700;800&display=block" rel="stylesheet">
<style>${CSS}</style></head><body>
<div class="s ${s.red ? 'red' : ''}">
 ${grid(s.red)}
 <div class="top"><div class="logo"><img src="${logo}"></div><div class="count"><b>${pad(i)}</b> / ${pad(n)}</div></div>
 <div class="mid">${mid}</div>
 <div class="foot"><div class="note"></div>${last ? '' : '<div class="swipe">Swipe <span>&rarr;</span></div>'}</div>
 <div class="bar" style="width:${Math.round(1080 * i / n)}px"></div>
</div></body></html>`;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const list = slides();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let i = 1; i <= list.length; i++) {
    await page.setContent(slideHtml(list[i - 1], i, list.length), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(outDir, `services-${i}.png`) });
  }
  await browser.close();
})();
