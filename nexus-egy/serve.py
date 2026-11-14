# Servidor local do Nexus Egy (com os cabeçalhos que o PSP precisa)
import http.server, socketserver, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'www'))
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.mjs': 'text/javascript'}
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'credentialless')
        super().end_headers()
socketserver.TCPServer.allow_reuse_address = True
socketserver.ThreadingTCPServer(('127.0.0.1', 8080), H).serve_forever()
