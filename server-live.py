#!/usr/bin/env python3
"""Serveur local pour l'annonce « Live » du site Saysko Photographie.

Démarre avec : python3 server-live.py
Lit l'URL du webhook depuis le Vault OpenBot (jamais exposée au navigateur).
Sert les fichiers du site sur http://127.0.0.1:3200 et répond à POST /api/live.
"""
import json
import os
import ssl
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen

# Certificats système macOS (évite CERTIFICATE_VERIFY_FAILED)
SSL_CTX = ssl.create_default_context(cafile="/etc/ssl/cert.pem")

HERE = Path(__file__).resolve().parent
VAULT = Path(os.environ.get(
    "DISCORD_LIVE_WEBHOOK_PATH",
    Path.home() / "Library/Application Support/OpenBot/agent-api-keys/.vault/"
                 "agent-09732205-07a1-4c01-afea-0fa07c7a6086/DISCORD_LIVE_WEBHOOK",
))
DEFAULT_LINK = "https://discord.gg/DeJSVe7xM"
PORT = int(os.environ.get("PORT", "3200"))


class Handler(BaseHTTPRequestHandler):
    def _json(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/live":
            return self._json(404, {"ok": False, "error": "Introuvable"})
        try:
            raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
            data = json.loads(raw or b"{}")
        except Exception:
            data = {}
        kind = "stop" if data.get("kind") == "stop" else "start"
        title = str(data.get("title") or "")[:200].strip() or "🎧 Saysko en live — studio photo"
        link = str(data.get("url") or "")[:300] or DEFAULT_LINK
        try:
            hook = VAULT.read_text().strip()
        except OSError:
            return self._json(500, {"ok": False, "error": "Webhook non configuré"})
        if not hook.startswith("https://discord.com/api/webhooks/"):
            return self._json(500, {"ok": False, "error": "Webhook invalide"})
        content = (
            f"🔴 **EN LIVE** — {title}\n\nRejoins le salon vocal : {link}"
            if kind == "start"
            else f"■ **Live terminé** — {title}\n\nMerci à tous 🎧"
        )
        payload = json.dumps({"content": content, "username": "Saysko Live 🎧"}).encode()
        try:
            req = Request(hook, data=payload, headers={
                "Content-Type": "application/json",
                "User-Agent": "SayskoLive/1.0 (Discord webhook)",
            }, method="POST")
            with urlopen(req, timeout=10, context=SSL_CTX) as resp:
                status = resp.status
        except Exception as exc:
            return self._json(502, {"ok": False, "error": f"Envoi impossible: {exc}"})
        self._json(200 if 200 <= status < 300 else 502, {"ok": 200 <= status < 300, "status": status})

    def do_GET(self):
        url = self.path.split("?")[0]
        if url == "/":
            url = "/index.html"
        fp = (HERE / url.lstrip("/")).resolve()
        if not str(fp).startswith(str(HERE)) or not fp.is_file():
            self.send_error(404)
            return
        types = {".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
                 ".js": "text/javascript; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png"}
        data = fp.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", types.get(fp.suffix.lower(), "application/octet-stream"))
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    print(f"site + live sur http://127.0.0.1:{PORT}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
