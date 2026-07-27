"""
하람보호소 SEO 런처 (유아독존과 동일 — 로컬 웹서버 + 브라우저)
"""

from __future__ import annotations

import os
import socket
import sys
import threading
import time
import webbrowser
from pathlib import Path

def _bundle_dir() -> Path:
    if getattr(sys, "frozen", False):
        meipass = getattr(sys, "_MEIPASS", None)
        if meipass:
            return Path(meipass)
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


ROOT = _bundle_dir()
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def _ensure_stdio() -> None:
    if sys.stdout is None:
        sys.stdout = open(os.devnull, "w", encoding="utf-8")
    if sys.stderr is None:
        sys.stderr = open(os.devnull, "w", encoding="utf-8")


def _load_env() -> None:
    from project_paths import project_root

    root = Path(project_root())
    os.environ["HARAM_PROJECT_ROOT"] = str(root)
    # 다른 보호소(달빛 등)에서 남은 Blob 토큰이 섞이지 않게 파일 값을 우선
    for name in (".env.local", ".env"):
        path = root / name
        if not path.exists():
            continue
        try:
            for line in path.read_text(encoding="utf-8-sig").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, _, v = line.partition("=")
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if not k:
                    continue
                # 하람 .env 값은 항상 덮어씀 (빈 토큰이면 잘못된 상속 토큰 제거)
                if k == "BLOB_READ_WRITE_TOKEN":
                    if v:
                        os.environ[k] = v
                    else:
                        os.environ.pop(k, None)
                elif k not in os.environ or k.startswith("NEXT_PUBLIC_"):
                    os.environ[k] = v
        except OSError:
            pass

    print(f"하람보호소 프로젝트: {root}")


def find_free_port(preferred: int = 8765) -> int:
    for port in range(preferred, preferred + 30):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return preferred


def wait_ready(port: int, timeout: float = 25.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.5):
                return True
        except OSError:
            time.sleep(0.2)
    return False


def main() -> None:
    _ensure_stdio()
    _load_env()
    import uvicorn

    port = find_free_port(8765)
    url = f"http://127.0.0.1:{port}"

    def open_browser() -> None:
        if wait_ready(port):
            webbrowser.open(url)

    threading.Thread(target=open_browser, daemon=True).start()

    from web_app import app

    print(f"하람보호소 SEO → {url}")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")


if __name__ == "__main__":
    main()
