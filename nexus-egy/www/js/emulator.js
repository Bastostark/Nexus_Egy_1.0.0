/* ============================================
   NEXUS EGY — Biblioteca + Emulação (EmulatorJS)
   Importa ROMs (arquivos, .zip, pastas), guarda no aparelho e joga.
   ============================================ */
(function () {
  'use strict';

  const SYS_EXT = {
    nes: ['nes', 'unf', 'unif'], snes: ['sfc', 'smc', 'fig', 'swc'], n64: ['n64', 'z64', 'v64'],
    gb: ['gb'], gbc: ['gbc'], gba: ['gba'], nds: ['nds'],
    segaMD: ['md', 'gen', 'smd'], segaMS: ['sms'], segaGG: ['gg'], psp: ['cso'], psx: ['chd']
  };
  const EXT_SYS = {};
  Object.entries(SYS_EXT).forEach(([s, l]) => l.forEach(e => EXT_SYS[e] = s));
  const CORE_OF = { gb: 'gba', gbc: 'gba', segaMS: 'segaMD', segaGG: 'segaMD' }; // núcleos embutidos
  const LABEL = { nes: 'NES', snes: 'Super Nintendo', n64: 'Nintendo 64', gb: 'Game Boy', gbc: 'Game Boy Color', gba: 'Game Boy Advance',
    nds: 'Nintendo DS', segaMD: 'Mega Drive', segaMS: 'Master System', segaGG: 'Game Gear', psp: 'PSP', psx: 'PlayStation 1' };
  const ICON = { nes: '🎮', snes: '🕹️', n64: '🏔️', gb: '🟢', gbc: '🌈', gba: '💜', nds: '📱', segaMD: '🎵', segaMS: '🔴', segaGG: '🔋', psp: '🔷', psx: '💿' };
  const CORES = ['mgba', 'snes9x', 'fceumm', 'genesis_plus_gx', 'pcsx_rearmed', 'melonds', 'mupen64plus_next', 'ppsspp-thread'].map(c => c + '-wasm.data');
  const CDN = 'https://cdn.emulatorjs.org/4.2.3/data/';
  const $ = id => document.getElementById(id);
  const extOf = n => (n.includes('.') ? n.split('.').pop() : '').toLowerCase();
  const cleanTitle = n => (n.replace(/\.[^.]+$/, '') || n).replace(/_/g, ' ').replace(/\(.*?\)|\[.*?\]/g, '').replace(/\s+/g, ' ').trim();
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

  // ---------- armazenamento (IndexedDB) ----------
  let dbp;
  const db = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open('NexusEgyLibrary', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('games', { keyPath: 'id', autoIncrement: true });
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const tx = async (mode, fn) => { const d = await db(); return new Promise((res, rej) => {
    const t = d.transaction('games', mode), rq = fn(t.objectStore('games'));
    t.oncomplete = () => res(rq && rq.result); t.onerror = () => rej(t.error); }); };
  const getAll = () => tx('readonly', s => s.getAll());
  const addGame = g => tx('readwrite', s => s.add(g));
  const delGame = id => tx('readwrite', s => s.delete(id));

  function toast(title, msg) {
    let t = $('nx-toast');
    if (!t) { t = document.createElement('div'); t.id = 'nx-toast'; document.body.appendChild(t); }
    t.innerHTML = '<b></b><span></span>'; t.firstChild.textContent = title; t.lastChild.textContent = msg;
    t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 4500);
  }

  // ---------- detectar console ----------
  async function detectSystem(name, blob) {
    const ext = extOf(name);
    if (EXT_SYS[ext]) return EXT_SYS[ext];
    const latin1 = u => new TextDecoder('latin1').decode(u);
    const head = async (o, n) => new Uint8Array(await blob.slice(o, o + n).arrayBuffer());
    if (ext === 'iso' || ext === 'img') {
      const s = latin1(await head(0, 700000));
      if (s.includes('PSP_GAME')) return 'psp';
      if (s.includes('SYSTEM.CNF')) return blob.size > 900 * 1048576 ? 'ps2' : 'psx';
      return null;
    }
    if (ext === 'bin') {
      if (latin1(await head(0x100, 4)) === 'SEGA') return 'segaMD';
      return blob.size > 16 * 1048576 ? 'psx' : null;
    }
    return null;
  }

  // ---------- leitor de .zip (sem bibliotecas) ----------
  async function zipEntries(file) {
    const tail = new DataView(await file.slice(Math.max(0, file.size - 65557)).arrayBuffer());
    let p = tail.byteLength - 22;
    while (p >= 0 && tail.getUint32(p, true) !== 0x06054b50) p--;
    if (p < 0) throw new Error('zip inválido');
    const n = tail.getUint16(p + 10, true), size = tail.getUint32(p + 12, true), off = tail.getUint32(p + 16, true);
    const cd = new DataView(await file.slice(off, off + size).arrayBuffer()), dec = new TextDecoder(), out = [];
    let q = 0;
    for (let i = 0; i < n && cd.getUint32(q, true) === 0x02014b50; i++) {
      const nl = cd.getUint16(q + 28, true), el = cd.getUint16(q + 30, true), cl = cd.getUint16(q + 32, true);
      out.push({ method: cd.getUint16(q + 10, true), csize: cd.getUint32(q + 20, true), lo: cd.getUint32(q + 42, true),
        name: dec.decode(new Uint8Array(cd.buffer, q + 46, nl)) });
      q += 46 + nl + el + cl;
    }
    return out;
  }
  async function zipExtract(file, e) {
    const lh = new DataView(await file.slice(e.lo, e.lo + 30).arrayBuffer());
    const start = e.lo + 30 + lh.getUint16(26, true) + lh.getUint16(28, true), raw = file.slice(start, start + e.csize);
    if (e.method === 0) return raw;
    if (e.method === 8) return await new Response(raw.stream().pipeThrough(new DecompressionStream('deflate-raw'))).blob();
    throw new Error('compressão não suportada');
  }

  // ---------- importar (arquivos soltos, .zip, pastas) ----------
  async function importFiles(list) {
    const files = Array.from(list); if (!files.length) return;
    toast('Nexus Egy', 'Lendo ' + files.length + ' arquivo(s)...');
    const ok = [], skip = [], queue = [];
    const seen = new Set((await getAll()).map(g => g.fileName + '|' + g.fileBlob.size));
    const BAD = { '7z': 'compactado em .7z/.rar: extraia antes (ou use .zip)', rar: 'compactado em .7z/.rar: extraia antes (ou use .zip)',
      wbfs: 'Wii não é suportado', rvz: 'Wii/GameCube não é suportado', gcz: 'GameCube não é suportado', nsp: 'Switch não é suportado', xci: 'Switch não é suportado' };
    for (const f of files) {
      if (extOf(f.name) !== 'zip') { queue.push({ name: f.name, blob: f }); continue; }
      try {
        const es = (await zipEntries(f)).filter(e => !e.name.endsWith('/'));
        let c = es.filter(e => EXT_SYS[extOf(e.name)]);
        if (!c.length) c = es.filter(e => ['iso', 'bin'].includes(extOf(e.name)));
        if (!c.length) { skip.push([f.name, 'nenhum jogo reconhecido dentro do .zip']); continue; }
        for (const e of c) queue.push({ name: e.name.split('/').pop(), blob: await zipExtract(f, e) });
      } catch (err) { skip.push([f.name, 'zip ilegível: ' + err.message]); }
    }
    const hasDisc = queue.some(q => ['bin', 'iso', 'chd'].includes(extOf(q.name)));
    for (const { name, blob } of queue) {
      const ext = extOf(name);
      if (BAD[ext]) { skip.push([name, BAD[ext]]); continue; }
      if (ext === 'cue') { if (!hasDisc) skip.push([name, '.cue sozinho: importe o .bin, .iso ou .chd']); continue; }
      let sys = null; try { sys = await detectSystem(name, blob); } catch (e) {}
      if (sys === 'ps2') { skip.push([name, 'PS2 não é suportado no navegador']); continue; }
      if (!sys) { if (['iso', 'bin', 'img'].includes(ext)) skip.push([name, 'disco não reconhecido (só PS1 e PSP)']); continue; }
      const key = name + '|' + blob.size; if (seen.has(key)) continue; seen.add(key);
      await addGame({ title: cleanTitle(name), fileName: name, system: sys, fileBlob: blob, added: Date.now() });
      ok.push(name);
    }
    await renderMine();
    toast(ok.length ? '✅ ' + ok.length + ' jogo(s) adicionado(s)' : 'Nenhum jogo novo',
      skip.length ? skip.length + ' ignorado(s): ' + skip.slice(0, 3).map(s => s[0] + ' — ' + s[1]).join(' | ') : 'Tudo certo!');
  }

  // ---------- interface da biblioteca ----------
  function buildUI() {
    const grid = $('library-grid'); if (!grid) return;
    const wrap = document.createElement('div'); wrap.className = 'nx-lib';
    wrap.innerHTML = `
      <div class="nx-bar">
        <button class="btn-primary" id="nx-add"><span class="material-icons-round">add</span> Importar jogos</button>
        <button class="btn-secondary" id="nx-scan"><span class="material-icons-round">folder_open</span> Escanear pasta</button>
        <span class="nx-hint">NES · SNES · N64 · GB/GBC/GBA · DS · Mega Drive · Master System · Game Gear · PS1 · PSP · .zip</span>
      </div>
      <div id="nx-empty" class="nx-empty">Sua biblioteca está vazia. Use <b>Importar jogos</b> ou arraste os arquivos para cá.</div>
      <div class="library-grid" id="my-games-grid"></div>
      <h3 class="nx-sub">Catálogo</h3>`;
    grid.parentNode.insertBefore(wrap, grid);
    const mk = (id, dir) => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.id = id; i.style.display = 'none';
      if (dir) { i.setAttribute('webkitdirectory', ''); i.setAttribute('directory', ''); }
      i.addEventListener('change', async () => { await importFiles(i.files); i.value = ''; }); document.body.appendChild(i); return i; };
    const fIn = mk('nx-file-in', false), dIn = mk('nx-dir-in', true);
    $('nx-add').onclick = () => fIn.click(); $('nx-scan').onclick = () => dIn.click();
    window.addEventListener('dragover', e => e.preventDefault());
    window.addEventListener('drop', e => { e.preventDefault(); importFiles(e.dataTransfer.files); });
  }

  async function renderMine() {
    const grid = $('my-games-grid'); if (!grid) return;
    const games = (await getAll()).sort((a, b) => a.title.localeCompare(b.title));
    grid.innerHTML = ''; $('nx-empty').style.display = games.length ? 'none' : 'block';
    games.forEach(g => {
      const c = document.createElement('div'); c.className = 'game-card nx-card';
      c.innerHTML = `<div class="game-card-bg" style="background:linear-gradient(135deg,rgba(212,168,87,.35),rgba(212,168,87,.08),#0a0a0f)"><div class="nx-ico">${ICON[g.system] || '🎮'}</div></div>
        <div class="game-card-overlay"></div><div class="game-card-info"><div class="game-card-title"></div><div class="game-card-console">${LABEL[g.system] || g.system}</div></div>
        <button class="nx-del" title="Remover">✕</button>`;
      c.querySelector('.game-card-title').textContent = g.title;
      c.onclick = () => play(g);
      c.querySelector('.nx-del').onclick = async e => { e.stopPropagation(); if (confirm('Remover "' + g.title + '" da biblioteca?')) { await delGame(g.id); renderMine(); } };
      c.onmouseenter = () => window.NexusSound && NexusSound.cardFocus();
      grid.appendChild(c);
    });
  }

  // ---------- emulação ----------
  let ejsReady;
  async function loadEJS() {
    if (ejsReady) return ejsReady;
    ejsReady = (async () => {
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'emulator/emulator.min.css'; document.head.appendChild(link);
      await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'emulator/emulator.min.js'; s.onload = res; s.onerror = () => rej(new Error('emulador não carregou')); document.body.appendChild(s); });
      const P = window.EmulatorJS.prototype, orig = P.getBaseFileName;
      // o motor recebe um blob: sem isto o ROM chega sem extensão (.iso/.sms/.gbc) e o núcleo não o reconhece
      P.getBaseFileName = function (forContent) {
        const r = orig.call(this, forContent);
        return (forContent && window.__ROM_FILENAME) ? window.__ROM_FILENAME.replace(/[#<$+%>!`&*'|{}/\\?"=@:^\r\n]/g, '') : r;
      };
      const paths = {}; CORES.forEach(f => { paths[f] = 'emulator/' + f; paths[f.replace('-wasm.data', '-legacy-wasm.data')] = 'emulator/' + f; }); // sem WebGL2 o motor pede o nome "legacy"
      let ready = []; try { ready = await (await fetch('emulator/ready.json')).json(); } catch (e) {}
      // extratores de compressão (os núcleos são .7z): local se o build os baixou; senão, CDN oficial
      ['extract7z.js', 'extractzip.js', 'libunrar.js', 'libunrar.js.mem'].forEach(f => paths[f] = ready.includes(f) ? 'emulator/compression/' + f : CDN + 'compression/' + f);
      return paths;
    })();
    ejsReady.catch(() => { ejsReady = null; });
    return ejsReady;
  }

  async function play(g) {
    if (g.system === 'psp' && !window.crossOriginIsolated)
      toast('PSP', 'O PSP só roda no programa do PC (precisa de recursos que o Android/navegador comum não liberam).');
    const view = $('nx-emu') || (() => {
      const v = document.createElement('div'); v.id = 'nx-emu';
      v.innerHTML = '<div class="nx-emu-top"><span id="nx-emu-title"></span><span class="nx-hint">Select + Start no controle, ou Esc, para sair</span><button class="btn-secondary" id="nx-exit">⏹ Sair</button></div><div id="nx-emu-target"></div>';
      document.body.appendChild(v); $('nx-exit').onclick = exitGame; return v; })();
    $('nx-emu-title').textContent = g.title + ' — ' + (LABEL[g.system] || g.system);
    view.classList.add('on');
    if (window.NexusSound) NexusSound.select();
    try {
      const paths = await loadEJS();
      window.__ROM_FILENAME = g.fileName;
      window.EJS_emulator = new window.EmulatorJS('#nx-emu-target', {
        gameUrl: URL.createObjectURL(g.fileBlob), system: CORE_OF[g.system] || g.system, gameName: g.title,
        dataPath: 'emulator/', filePaths: paths, startOnLoad: true
      });
      startPad();
    } catch (err) { toast('Erro ao iniciar', err.message); view.classList.remove('on'); }
  }
  function exitGame() { if (confirm('Voltar ao menu do Nexus Egy?')) location.reload(); }
  function startPad() {
    (function tick() {
      const gp = (navigator.getGamepads ? navigator.getGamepads() : [])[0];
      if (gp && gp.buttons[8] && gp.buttons[9] && gp.buttons[8].pressed && gp.buttons[9].pressed) return exitGame();
      requestAnimationFrame(tick);
    })();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('nx-emu') && $('nx-emu').classList.contains('on')) exitGame(); });

  // botão "Jogar" do catálogo: usa o arquivo que você importou com o mesmo nome
  function hookModalPlay() {
    const b = $('modal-play'); if (!b) return;
    b.addEventListener('click', async () => {
      const title = $('modal-title').textContent, t = norm(title), games = await getAll();
      const g = games.find(x => norm(x.title) === t) || games.find(x => { const n = norm(x.title); return n && t && (n.includes(t) || t.includes(n)); });
      if (g) { $('game-modal').classList.remove('active'); play(g); }
      else toast('Jogo não encontrado', 'Importe o arquivo de "' + title + '" em Biblioteca → Importar jogos para jogar.');
    });
  }

  const css = document.createElement('style');
  css.textContent = `
  .nx-bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:6px 0 18px}
  .nx-hint{color:var(--text-secondary);font-size:12px;letter-spacing:.5px}
  .nx-empty{padding:26px;border:1px dashed rgba(var(--accent-rgb),.35);border-radius:14px;color:var(--text-secondary);margin-bottom:18px}
  .nx-sub{margin:26px 0 12px;color:var(--text-secondary);font-weight:400;letter-spacing:2px;text-transform:uppercase;font-size:13px}
  .nx-ico{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:56px}
  .nx-card{position:relative}.nx-del{position:absolute;top:8px;right:8px;z-index:5;border:0;border-radius:50%;width:26px;height:26px;background:rgba(0,0,0,.65);color:#fff;cursor:pointer;opacity:0;transition:.2s}
  .nx-card:hover .nx-del{opacity:1}
  #nx-toast{position:fixed;top:20px;right:20px;z-index:100000;max-width:min(460px,86vw);background:rgba(17,17,24,.96);border:1px solid var(--accent);color:var(--text-primary);padding:12px 16px;border-radius:12px;font-size:13px;display:flex;flex-direction:column;gap:3px;opacity:0;transform:translateY(-12px);pointer-events:none;transition:.3s}
  #nx-toast.show{opacity:1;transform:none}#nx-toast b{color:var(--accent-light)}
  #nx-emu{position:fixed;inset:0;z-index:99990;background:#000;display:none;flex-direction:column}#nx-emu.on{display:flex}
  .nx-emu-top{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:8px 16px;background:var(--bg-card);color:var(--text-primary);font-size:14px}
  #nx-emu-target{flex:1;min-height:0;position:relative}`;
  document.head.appendChild(css);

  buildUI(); hookModalPlay(); renderMine();
  window.NexusLibrary = { importFiles, play, getAll };
})();
