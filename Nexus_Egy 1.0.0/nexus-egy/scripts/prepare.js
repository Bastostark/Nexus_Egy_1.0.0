// Roda no "npm install": baixa o extrator de compressão do EmulatorJS e copia as fontes locais (app 100% offline).
const fs = require('fs'), path = require('path'), https = require('https');
const W = path.join(__dirname, '..', 'www'), NM = path.join(__dirname, '..', 'node_modules');
const get = url => new Promise((res, rej) => https.get(url, r => {
  if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return res(get(r.headers.location));
  if (r.statusCode !== 200) { r.resume(); return rej(new Error('HTTP ' + r.statusCode)); }
  const c = []; r.on('data', d => c.push(d)); r.on('end', () => res(Buffer.concat(c)));
}).on('error', rej));
const find = (root, re) => { if (!fs.existsSync(root)) return null;
  for (const e of fs.readdirSync(root, { withFileTypes: true })) { const p = path.join(root, e.name);
    if (e.isDirectory()) { const r = find(p, re); if (r) return r; } else if (re.test(e.name)) return p; } return null; };
(async () => {
  try {
    const dir = path.join(W, 'emulator', 'compression'); fs.mkdirSync(dir, { recursive: true }); const ready = [];
    for (const f of ['extract7z.js', 'extractzip.js', 'libunrar.js', 'libunrar.js.mem']) {
      try { fs.writeFileSync(path.join(dir, f), await get('https://cdn.emulatorjs.org/4.2.3/data/compression/' + f)); ready.push(f); }
      catch (e) { console.log('[prepare] não baixou', f, e.message); }
    }
    fs.writeFileSync(path.join(W, 'emulator', 'ready.json'), JSON.stringify(ready));
    console.log('[prepare] compressão:', ready.join(', ') || 'nenhum (o app usará a CDN)');
  } catch (e) { console.log('[prepare] compressão falhou:', e.message); }
  try {
    const o = find(NM + '/@fontsource-variable/outfit', /latin-wght-normal\.woff2$/), r = find(NM + '/@fontsource-variable/orbitron', /latin-wght-normal\.woff2$/), i = find(NM + '/material-icons', /material-icons-round\.woff2$/);
    if (o && r && i) {
      const fd = path.join(W, 'fonts'); fs.mkdirSync(fd, { recursive: true });
      fs.copyFileSync(o, path.join(fd, 'outfit.woff2')); fs.copyFileSync(r, path.join(fd, 'orbitron.woff2')); fs.copyFileSync(i, path.join(fd, 'icons.woff2'));
      fs.writeFileSync(path.join(W, 'css', 'fonts.css'),
`@font-face{font-family:'Outfit';src:url(../fonts/outfit.woff2) format('woff2');font-weight:200 800;font-display:swap}
@font-face{font-family:'Orbitron';src:url(../fonts/orbitron.woff2) format('woff2');font-weight:400 900;font-display:swap}
@font-face{font-family:'Material Icons Round';src:url(../fonts/icons.woff2) format('woff2');font-weight:400;font-style:normal}
.material-icons-round{font-family:'Material Icons Round';font-weight:normal;font-style:normal;font-size:24px;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;direction:ltr;-webkit-font-feature-settings:'liga';font-feature-settings:'liga';-webkit-font-smoothing:antialiased}
`);
      console.log('[prepare] fontes locais OK');
    } else console.log('[prepare] fontes locais não encontradas (usa Google Fonts online)');
  } catch (e) { console.log('[prepare] fontes falharam:', e.message); }
})();
