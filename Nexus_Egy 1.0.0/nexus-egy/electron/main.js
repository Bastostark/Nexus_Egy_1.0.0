const { app, BrowserWindow, protocol, net, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');

// ====== ARQUIVO ÚNICO ======
// Este main.js contém tudo: o preload (gerado na hora de abrir) e as alterações do js/app.js
// (aplicadas quando o app carrega o arquivo). Basta substituir este arquivo.
const PRELOAD_SRC = "const { contextBridge, ipcRenderer, webUtils } = require('electron');\ncontextBridge.exposeInMainWorld('nexusNative', {\n  pathOf: file => { try { return webUtils.getPathForFile(file) || ''; } catch (e) { return (file && file.path) || ''; } },\n  launch: (system, romPath) => ipcRenderer.invoke('nexus:launch', system, romPath),\n  chooseEmulator: system => ipcRenderer.invoke('nexus:choose-emulator', system)\n});\n";
const APP_JS_PATCHES = [
 [
  "if (s.includes('PSP_GAME')) return 'psp';",
  "if (latin1(await head(0x10000, 20)) === 'MICROSOFT*XBOX*MEDIA' || latin1(await head(0xFD90000, 20)) === 'MICROSOFT*XBOX*MEDIA') return 'xbox'; if (s.includes('PSP_GAME')) return 'psp'; if (s.includes('PS3_GAME') || s.includes('PS3_DISC.SFB')) return 'ps3';",
  1
 ],
 [
  "if (s.includes('SYSTEM.CNF')) return blob.size > 900 * 1048576 ? 'ps2' : 'psx';",
  "if (s.includes('SYSTEM.CNF')) return (s.includes('BOOT2') || blob.size > 900 * 1048576) ? 'ps2' : 'psx';",
  1
 ],
 [
  "if (sys === 'ps2') return { valid: false, error: 'ps2' };",
  "if (['ps2', 'ps3', 'xbox'].includes(sys)) { if (!window.nexusNative) return { valid: false, error: 'native' }; return { valid: true, system: sys, console: { ps2: 'PlayStation 2', ps3: 'PlayStation 3', xbox: 'Xbox' }[sys], format: '.' + ext, native: true }; }",
  1
 ],
 [
  "if (check.error === 'ps2') { if (!many) alert('PS2 não é suportado.'); continue; }",
  "if (check.error === 'native') { if (!many) alert('PS2, PS3 e Xbox só rodam no programa do PC (Nexus Egy para Windows).'); continue; }",
  1
 ],
 [
  "alert('Disco não reconhecido (só PS1 e PSP).')",
  "alert('Disco não reconhecido (aceito: PS1, PS2, PS3, PSP e Xbox).')",
  1
 ],
 [
  "fileBlob: file,",
  "fileBlob: check.native ? undefined : file, nativePath: check.native ? window.nexusNative.pathOf(file) : undefined,",
  2
 ],
 [
  "      'PSP': 'psp',",
  "      'PSP': 'psp',\r\n      'PS2': 'ps2', 'PlayStation 2': 'ps2', 'PS3': 'ps3', 'PlayStation 3': 'ps3', 'Xbox': 'xbox',",
  1
 ],
 [
  "    { id: 'wiiu', name: 'Wii U'",
  "    { id: 'xbox', name: 'Xbox', icon: '🟩', era: '6ª Geração', year: '2001', formats: ['.iso'], tier: 3,\r\n      image3d: 'assets/logo.svg' },\r\n    { id: 'wiiu', name: 'Wii U'",
  1
 ],
 [
  "if (game.fileBlob || game.romUrl) {",
  "if (game.fileBlob || game.romUrl || game.nativePath) {",
  1
 ],
 [
  "    launchGame(game) {",
  "    launchGame(game) { if (this.launchIfNative(game)) return;",
  1
 ],
 [
  "    closeGame(silent) {",
  "    launchIfNative(game) {\r\n      const sys = game.system || this.CONSOLE_CORE_MAP[game.console];\r\n      if (game.nativePath || ['ps2', 'ps3', 'xbox'].includes(sys)) { this.launchNative(game, sys); return true; }\r\n      return false;\r\n    },\r\n\r\n    async launchNative(game, sys) {\r\n      const nn = window.nexusNative;\r\n      if (!nn) { alert('PS2, PS3 e Xbox só rodam no programa do PC (Nexus Egy para Windows).'); return; }\r\n      if (!game.nativePath) { alert('Para jogar ' + game.title + ', escolha o arquivo do jogo (.iso) no seu computador.'); return; }\r\n      NexusSound.boot();\r\n      const r = await nn.launch(sys, game.nativePath);\r\n      if (!r.ok) alert(r.error);\r\n    },\r\n\r\n    closeGame(silent) {",
  1
 ]
];
const APP_JS_DIAG = ["f.onload = () => { try { f.contentWindow.nexusStart(cfg).catch(() => alert('Não foi possível iniciar o emulador.')); } catch (e) { alert('Não foi possível iniciar o emulador.'); } };", "f.onload = () => { const fail = err => alert('Não foi possível iniciar o emulador.' + (err ? '\\n\\nMotivo: ' + (err.message || err) : '')); try { f.contentWindow.nexusStart(cfg).catch(fail); } catch (e) { fail(e); } };"];
function patchAppJs(text) {
  const mark = 'launchIfNative';
  if (!text.includes(mark)) {
    for (const [oldS, newS, count] of APP_JS_PATCHES) {
      if (text.split(oldS).length - 1 !== count) { console.warn('[nexus] trecho não encontrado, ignorado:', oldS.slice(0, 50)); continue; }
      text = text.split(oldS).join(newS);
    }
  }
  if (text.includes(APP_JS_DIAG[0])) text = text.split(APP_JS_DIAG[0]).join(APP_JS_DIAG[1]);
  return text;
}


// O Nexus roda por um protocolo próprio (app://nexus/) em vez de file://.
// Motivo: em file:// o Chromium trata cada arquivo como uma origem diferente, e isso
// bloqueia o acesso entre a tela principal e a moldura (iframe) do emulador,
// além de impedir o jogo (blob:) de ser lido pelo emulador.
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }
]);

// deixa o som do emulador tocar sem precisar de um clique antes
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// pasta onde estão index.html / js / css (no instalador é a raiz; no repositório fica em ../www)
const APP_ROOT = (() => {
  for (const d of [__dirname, path.join(__dirname, '..', 'www'), path.join(__dirname, 'www'), path.join(__dirname, '..')]) {
    try { if (fs.existsSync(path.join(d, 'index.html'))) return path.normalize(d); } catch (e) {}
  }
  return path.normalize(__dirname);
})();

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webmanifest': 'application/manifest+json'
};

// ====== EMULADORES NATIVOS (PS2 / PS3 / Xbox) ======
// Esses consoles são pesados demais para rodar dentro de uma página web, então o Nexus
// abre o emulador instalado no PC já com o jogo carregado.
const EMUS = {
  ps2: {
    name: 'PCSX2', site: 'https://pcsx2.net/downloads', exes: ['pcsx2-qt.exe', 'pcsx2-qtx64.exe', 'pcsx2-qtx64-avx2.exe', 'pcsx2.exe'],
    dirs: ['PCSX2', 'pcsx2', 'PCSX2-Qt', 'PCSX2 Nightly'],
    args: (exe, rom) => path.basename(exe).toLowerCase() === 'pcsx2.exe' ? ['--nogui', '--fullscreen', rom] : ['-batch', '-fullscreen', '--', rom]
  },
  ps3: {
    name: 'RPCS3', site: 'https://rpcs3.net/download', exes: ['rpcs3.exe'], dirs: ['RPCS3', 'rpcs3'],
    args: (exe, rom) => ['--no-gui', rom]
  },
  xbox: {
    name: 'xemu', site: 'https://xemu.app/docs/getting-started/', exes: ['xemu.exe'], dirs: ['xemu', 'Xemu'],
    args: (exe, rom) => ['-full-screen', '-dvd_path', rom]
  },
  gamecube: {
    name: 'Dolphin (GameCube)', site: 'https://dolphin-emu.org/download/', exes: ['Dolphin.exe', 'dolphin.exe'],
    dirs: ['dolphin', 'Dolphin', 'Dolphin-x64'],
    args: (exe, rom) => ['-b', '-e', rom]
  },
  wii: {
    name: 'Dolphin (Wii)', site: 'https://dolphin-emu.org/download/', exes: ['Dolphin.exe', 'dolphin.exe'],
    dirs: ['dolphin', 'Dolphin', 'Dolphin-x64'],
    args: (exe, rom) => ['-b', '-e', rom]
  }
};
const projectConfigFile = () => {
  for (const dir of [path.join(__dirname, '..'), APP_ROOT, process.cwd()]) {
    const p = path.join(dir, 'config.json');
    if (fs.existsSync(p)) return p;
  }
  return path.join(__dirname, '..', 'config.json');
};

const cfgFile = () => path.join(app.getPath('userData'), 'emulators.json');

const readCfg = () => {
  const result = {};
  // 1. Tenta carregar do config.json local do projeto (Opção 3)
  try {
    const pFile = projectConfigFile();
    if (fs.existsSync(pFile)) {
      const parsed = JSON.parse(fs.readFileSync(pFile, 'utf8'));
      if (parsed.emulators) {
        for (const [k, v] of Object.entries(parsed.emulators)) {
          const val = typeof v === 'string' ? v : v.path;
          if (val) {
            result[k] = path.isAbsolute(val) ? val : path.resolve(path.dirname(pFile), val);
          }
        }
      } else {
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === 'string') {
            result[k] = path.isAbsolute(v) ? v : path.resolve(path.dirname(pFile), v);
          }
        }
      }
    }
  } catch (e) {}

  // 2. Mescla com emulators.json do userData (caso o usuário tenha configurado pelo app)
  try {
    const userCfg = JSON.parse(fs.readFileSync(cfgFile(), 'utf8'));
    Object.assign(result, userCfg);
  } catch (e) {}

  return result;
};

const writeCfg = c => {
  try { fs.writeFileSync(cfgFile(), JSON.stringify(c, null, 2)); } catch (e) {}
  try {
    const pFile = projectConfigFile();
    const current = fs.existsSync(pFile) ? JSON.parse(fs.readFileSync(pFile, 'utf8')) : { emulators: {} };
    if (!current.emulators) current.emulators = {};
    for (const [k, v] of Object.entries(c)) {
      if (!current.emulators[k]) current.emulators[k] = {};
      if (typeof current.emulators[k] === 'object') current.emulators[k].path = v;
      else current.emulators[k] = v;
    }
    fs.writeFileSync(pFile, JSON.stringify(current, null, 2), 'utf8');
  } catch (e) {}
};

const isFile = p => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };

function autoDetect(emu) {
  // 1. Prioridade Máxima: Pasta integrada de emuladores do projeto (Opção 1)
  const localProjectDirs = [
    path.join(__dirname, '..', 'emulators'),
    path.join(APP_ROOT, 'emulators'),
    path.join(process.cwd(), 'emulators')
  ];
  for (const root of localProjectDirs) {
    for (const d of ['', ...emu.dirs]) for (const exe of emu.exes) {
      const p = path.join(root, d, exe);
      if (isFile(p)) return p;
    }
  }

  // 2. Busca nos diretórios padrão do sistema operacional
  const bases = [process.env['ProgramFiles'], process.env['ProgramFiles(x86)'], process.env['LOCALAPPDATA'], process.env['APPDATA'], 'C:\\', 'D:\\'];
  ['desktop', 'downloads', 'documents', 'home'].forEach(n => { try { bases.push(app.getPath(n)); } catch (e) {} });
  for (const b of bases.filter(Boolean)) {
    for (const d of ['', ...emu.dirs]) for (const exe of emu.exes) {
      const p = path.join(b, d, exe);
      if (isFile(p)) return p;
    }
  }
  return null;
}

async function chooseEmulator(win, system) {
  const emu = EMUS[system];
  const ask = await dialog.showMessageBox(win, {
    type: 'info', title: 'Nexus Egy', buttons: ['Procurar no PC', 'Baixar ' + emu.name, 'Cancelar'], defaultId: 0, cancelId: 2,
    message: 'O emulador ' + emu.name + ' não foi encontrado.',
    detail: 'Instale o ' + emu.name + ' (gratuito) e configure a BIOS/firmware dele uma vez. Depois clique em "Procurar no PC" e escolha o arquivo ' + emu.exes[0] + '.'
  });
  if (ask.response === 1) { shell.openExternal(emu.site); return null; }
  if (ask.response !== 0) return null;
  const pick = await dialog.showOpenDialog(win, {
    title: 'Selecione o ' + emu.exes[0], properties: ['openFile'], filters: [{ name: 'Executável', extensions: ['exe'] }]
  });
  if (pick.canceled || !pick.filePaths[0]) return null;
  const cfg = readCfg(); cfg[system] = pick.filePaths[0]; writeCfg(cfg);
  return pick.filePaths[0];
}

function registerIpc() {
  ipcMain.handle('nexus:choose-emulator', async (ev, system) => {
    if (!EMUS[system]) return { ok: false, error: 'Console inválido.' };
    const p = await chooseEmulator(BrowserWindow.fromWebContents(ev.sender), system);
    return p ? { ok: true } : { ok: false, error: 'Nenhum emulador selecionado.' };
  });

  ipcMain.handle('nexus:launch', async (ev, system, romPath) => {
    const emu = EMUS[system];
    if (!emu) return { ok: false, error: 'Console não suportado: ' + system };
    if (typeof romPath !== 'string' || !isFile(romPath)) return { ok: false, error: 'Não encontrei o arquivo do jogo no PC. Ele foi movido ou apagado? Escolha o arquivo de novo.' };
    const win = BrowserWindow.fromWebContents(ev.sender);
    const cfg = readCfg();
    let exe = cfg[system] && isFile(cfg[system]) ? cfg[system] : autoDetect(emu);
    if (!exe) exe = await chooseEmulator(win, system);
    if (!exe) return { ok: false, error: 'Para jogar este console é preciso ter o ' + emu.name + ' instalado.' };
    if (cfg[system] !== exe) { cfg[system] = exe; writeCfg(cfg); }
    return await new Promise(resolve => {
      try {
        const child = spawn(exe, emu.args(exe, romPath), { cwd: path.dirname(exe), detached: true, stdio: 'ignore' });
        child.once('error', e => resolve({ ok: false, error: 'Não consegui abrir o ' + emu.name + ': ' + e.message }));
        child.once('spawn', () => { child.unref(); resolve({ ok: true }); });
      } catch (e) { resolve({ ok: false, error: 'Não consegui abrir o ' + emu.name + ': ' + e.message }); }
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 720, autoHideMenuBar: true,
    webPreferences: { preload: path.join(app.getPath('userData'), 'nexus-preload.js'), contextIsolation: true }
  });
  win.maximize();
  if (protocol.handle) win.loadURL('app://nexus/index.html');
  else win.loadFile(path.join(APP_ROOT, 'index.html')); // Electron muito antigo: comportamento anterior
}

app.whenReady().then(() => {
  try { fs.mkdirSync(app.getPath('userData'), { recursive: true }); fs.writeFileSync(path.join(app.getPath('userData'), 'nexus-preload.js'), PRELOAD_SRC); } catch (e) {}
  registerIpc();
  if (protocol.handle) {
    const root = APP_ROOT;
    protocol.handle('app', async request => {
      let rel = decodeURIComponent(new URL(request.url).pathname);
      if (rel === '/' || rel === '') rel = '/index.html';
      const filePath = path.normalize(path.join(root, rel));
      if (!filePath.startsWith(root)) return new Response('Forbidden', { status: 403 });
      try {
        const res = await net.fetch(pathToFileURL(filePath).toString());
        const headers = new Headers(res.headers);
        const type = MIME[path.extname(filePath).toLowerCase()];
        if (type) headers.set('Content-Type', type);
        // libera os recursos que alguns núcleos (ex.: PSP) exigem (SharedArrayBuffer)
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
        if (rel === '/js/app.js') {
          const body = patchAppJs(await res.text());
          headers.delete('Content-Length');
          return new Response(body, { status: res.status, headers });
        }
        return new Response(res.body, { status: res.status, headers });
      } catch (e) {
        return new Response('Not found', { status: 404 });
      }
    });
  }
  createWindow();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

module.exports = { patchAppJs };
