const { app, BrowserWindow, Menu } = require('electron');
const http = require('http'), fs = require('fs'), path = require('path');

// Servidor local com COOP/COEP: o PSP (PPSSPP) precisa de SharedArrayBuffer
function serve() {
  const root = path.join(__dirname, '..', 'www');
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.wasm': 'application/wasm', '.jpg': 'image/jpeg' };
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      let f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
      if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(root, 'index.html');
      res.writeHead(200, {
        'Content-Type': types[path.extname(f)] || 'application/octet-stream',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'credentialless'
      });
      fs.createReadStream(f).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve(srv.address().port));
  });
}

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

app.whenReady().then(async () => {
  const port = await serve();
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 1280, height: 720, backgroundColor: '#0e6cc4', title: 'Nexus Egy',
    webPreferences: { contextIsolation: true }
  });
  win.setFullScreen(true);
  win.webContents.on('before-input-event', (e, i) => {
    if (i.type === 'keyDown' && i.key === 'F11') win.setFullScreen(!win.isFullScreen());
  });
  win.loadURL('http://127.0.0.1:' + port + '/');
});
app.on('window-all-closed', () => app.quit());
