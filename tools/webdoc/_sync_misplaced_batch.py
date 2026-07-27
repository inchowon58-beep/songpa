# -*- coding: utf-8 -*-
"""Misplaced webdoc_haram batches → 하람보호소 public/seo-data 동기화."""
from __future__ import annotations

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

HARAM = Path(r"C:\Users\USER\Desktop\준모웹이미지\하람보호소")
SRC = Path(
    r"C:\Users\USER\Desktop\준모웹이미지\달빗쉘터\tools\webdoc\dist\달빛쉘터웹문서생성기\output\webdoc_haram_20260727_180158"
)
DST_PAGES = HARAM / "public" / "seo-data" / "pages"
DST_INDEX = HARAM / "public" / "seo-data" / "index.json"


def main() -> None:
    DST_PAGES.mkdir(parents=True, exist_ok=True)
    slugs: list[str] = []
    if DST_INDEX.is_file():
        try:
            existing = json.loads(DST_INDEX.read_text(encoding="utf-8-sig"))
            slugs = list(existing.get("slugs") or [])
        except Exception:
            slugs = []

    added = 0
    for batch in sorted(SRC.glob("batch_*/pages")):
        for src in batch.glob("*.json"):
            shutil.copy2(src, DST_PAGES / src.name)
            slug = src.stem
            if slug in slugs:
                slugs.remove(slug)
            slugs.insert(0, slug)
            added += 1

    index = {
        "slugs": slugs,
        "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
    }
    DST_INDEX.write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"synced files={added} total_slugs={len(slugs)} -> {DST_PAGES}")


if __name__ == "__main__":
    main()
