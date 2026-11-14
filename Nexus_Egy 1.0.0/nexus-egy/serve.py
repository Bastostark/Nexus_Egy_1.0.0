# Servidor local do Nexus Egy (com COOP/COEP e ponte de inicializacao de emuladores)
import http.server, socketserver, os, sys, urllib.parse, subprocess, json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WWW_DIR = os.path.join(BASE_DIR, 'www')
os.chdir(WWW_DIR)

class NexusHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.wasm': 'application/wasm',
        '.woff2': 'font/woff2',
        '.mjs': 'text/javascript',
        '.json': 'application/json'
    }

    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'credentialless')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        # API de Execucao de Emuladores Nativos (PS2, PS3, Xbox)
        if self.path.startswith('/api/launch'):
            parsed = urllib.parse.urlparse(self.path)
            query = urllib.parse.parse_qs(parsed.query)
            system = query.get('system', [''])[0].lower().strip()
            rom = query.get('rom', [''])[0].strip()

            cfg_path = os.path.join(BASE_DIR, 'config.json')
            exe = None
            args = []

            if os.path.exists(cfg_path):
                try:
                    with open(cfg_path, 'r', encoding='utf-8') as f:
                        cfg = json.load(f)
                        em = cfg.get('emulators', {}).get(system, {})
                        p = em.get('path', '')
                        if p:
                            exe = os.path.normpath(os.path.join(BASE_DIR, p)) if not os.path.isabs(p) else p
                            args = em.get('args', [])
                except Exception as e:
                    print('[API Launch] Erro ao ler config.json:', e)

            # Fallback se nao achou pelo config.json
            if not exe or not os.path.exists(exe):
                if system in ['ps2', 'playstation 2']:
                    for cand in ['pcsx2-qt.exe', 'pcsx2.exe']:
                        cp = os.path.join(BASE_DIR, 'emulators', 'pcsx2', cand)
                        if os.path.exists(cp):
                            exe = cp; break
                    args = ['--fullscreen', '--nogui', '--batch', '--']
                elif system in ['ps3', 'playstation 3']:
                    exe = os.path.join(BASE_DIR, 'emulators', 'rpcs3', 'rpcs3.exe')
                    args = ['--no-gui']
                elif system in ['xbox', 'xbox original']:
                    exe = os.path.join(BASE_DIR, 'emulators', 'xemu', 'xemu.exe')
                    args = ['-full-screen', '-dvd_path']
                elif system in ['gamecube', 'wii', 'dolphin', 'nintendo wii']:
                    for cand in ['Dolphin.exe', 'dolphin.exe']:
                        cp = os.path.join(BASE_DIR, 'emulators', 'dolphin', cand)
                        if os.path.exists(cp):
                            exe = cp; break
                    args = ['-b', '-e']

            if exe and os.path.exists(exe):
                try:
                    cmd = [exe] + args
                    if rom:
                        cmd.append(rom)
                    print(f"[API Launch] Executando: {cmd}")
                    subprocess.Popen(cmd, cwd=os.path.dirname(exe))
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'ok': True, 'exe': exe}).encode())
                    return
                except Exception as err:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'ok': False, 'error': str(err)}).encode())
                    return
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                msg = f"Emulador para {system.upper()} nao encontrado em:\n{exe or 'pasta emulators/'}"
                self.wfile.write(json.dumps({'ok': False, 'error': msg}).encode())
                return

        super().do_GET()

socketserver.TCPServer.allow_reuse_address = True
print("Servidor Nexus Egy rodando em http://127.0.0.1:8080/")
socketserver.ThreadingTCPServer(('127.0.0.1', 8080), NexusHandler).serve_forever()
