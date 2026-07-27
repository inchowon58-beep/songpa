# -*- coding: utf-8 -*-
"""프로젝트 루트·스크립트 경로 (소스 / exe 공통).

하람보호소 전용 — package.json name 이 haram-shelter 인 폴더만 루트로 인정한다.
(같은 PC에 달빛쉘터 등 유사 프로젝트가 있어도 섞이지 않게.)
"""

from __future__ import annotations

import json
import os
import re
import sys
from typing import Optional

EXPECTED_PACKAGE_NAME = "haram-shelter"


def _package_name(root: str) -> Optional[str]:
    pkg = os.path.join(root, "package.json")
    if not os.path.isfile(pkg):
        return None
    try:
        with open(pkg, encoding="utf-8-sig") as f:
            data = json.load(f)
        name = data.get("name")
        return str(name).strip() if name else None
    except (OSError, ValueError, TypeError):
        return None


def _is_haram_root(path: str) -> bool:
    if not (os.path.isfile(os.path.join(path, "package.json")) and os.path.isdir(os.path.join(path, "public"))):
        return False
    name = _package_name(path)
    return name == EXPECTED_PACKAGE_NAME


def project_root() -> str:
    # 1) 환경변수 최우선
    for key in ("HARAM_PROJECT_ROOT", "HARAM_SHELTER_ROOT"):
        env = os.environ.get(key, "").strip().strip('"').strip("'")
        if env and _is_haram_root(env):
            return os.path.abspath(env)

    starts = []
    if getattr(sys, "frozen", False):
        starts.append(os.path.dirname(sys.executable))
    starts.append(os.path.dirname(os.path.abspath(__file__)))
    starts.append(os.getcwd())

    # 2) 하람 package.json 이 있는 조상만 채택
    for start in starts:
        cur = os.path.abspath(start)
        for _ in range(12):
            if _is_haram_root(cur):
                return cur
            parent = os.path.dirname(cur)
            if parent == cur:
                break
            cur = parent

    # 3) 형제/상위 폴더에서 haram-shelter 탐색 (exe 가 다른 트리에 있어도)
    search_bases = []
    for start in starts:
        cur = os.path.abspath(start)
        for _ in range(6):
            search_bases.append(cur)
            parent = os.path.dirname(cur)
            if parent == cur:
                break
            cur = parent
    seen = set()
    for base in search_bases:
        if base in seen:
            continue
        seen.add(base)
        try:
            for name in os.listdir(base):
                cand = os.path.join(base, name)
                if _is_haram_root(cand):
                    return cand
        except OSError:
            continue

    # 4) 최후: 소스 기준 상대 경로
    fallback = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    return fallback


def blob_upload_script() -> str:
    root = project_root()
    candidates = [
        os.path.join(root, "tools", "webdoc", "blob-upload.mjs"),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "blob-upload.mjs"),
    ]
    meipass = getattr(sys, "_MEIPASS", None)
    if meipass:
        candidates.append(os.path.join(meipass, "blob-upload.mjs"))
    # exe 옆 (add-data)
    if getattr(sys, "frozen", False):
        candidates.insert(
            0, os.path.join(os.path.dirname(sys.executable), "blob-upload.mjs")
        )
        internal = os.path.join(os.path.dirname(sys.executable), "_internal", "blob-upload.mjs")
        candidates.insert(1, internal)
    for path in candidates:
        if os.path.isfile(path):
            return path
    return candidates[0]


def webdoc_dir() -> str:
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


def load_blob_token() -> Optional[str]:
    """하람 .env.local 토큰을 우선. (다른 프로젝트 상속 env 토큰은 무시)"""
    root = project_root()
    for name in (".env.local", ".env"):
        path = os.path.join(root, name)
        if not os.path.isfile(path):
            continue
        try:
            text = open(path, encoding="utf-8-sig").read()
        except OSError:
            continue
        m = re.search(
            r"^(?:export\s+)?BLOB_READ_WRITE_TOKEN\s*=\s*[\"']?([^\"'\r\n#]+)[\"']?",
            text,
            re.M,
        )
        if m:
            token = m.group(1).strip()
            if token:
                return token
        m2 = re.search(
            r"^(?:export\s+)?(\w*BLOB\w*READ_WRITE_TOKEN)\s*=\s*[\"']?([^\"'\r\n#]+)[\"']?",
            text,
            re.M,
        )
        if m2:
            token = m2.group(2).strip()
            if token:
                return token

    env = os.environ.get("BLOB_READ_WRITE_TOKEN", "").strip()
    return env or None
