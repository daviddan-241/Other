import http.server
import socketserver
import os
import urllib.parse
import json

PORT = 5000
HOST = "0.0.0.0"

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/index.html":
            self.serve_file("index.html", "text/html")
        elif path.startswith("/file/"):
            filename = urllib.parse.unquote(path[6:])
            safe_name = os.path.basename(filename)
            if safe_name.endswith(".txt") and os.path.exists(safe_name):
                self.serve_file(safe_name, "text/plain; charset=utf-8")
            else:
                self.send_error(404, "File not found")
        else:
            super().do_GET()

    def serve_file(self, filepath, content_type):
        try:
            with open(filepath, "rb") as f:
                data = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self.send_error(500, str(e))

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
    print(f"Serving on http://{HOST}:{PORT}")
    httpd.serve_forever()
