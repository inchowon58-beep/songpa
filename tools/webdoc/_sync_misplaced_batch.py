# -*- coding: utf-8 -*-
"""Misplaced webdoc_pogeun batches → 포근쉼터 public/seo-data 동기화 (필요 시 수동 실행)."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

POGEUN = Path(r"C:\Users\USER\Desktop\준모웹이미지\포근쉼터")
# 예: 잘못 생성된 배치 폴더가 있으면 아래 경로를 수정 후 실행
BATCH = Path(
    r"C:\Users\USER\Desktop\준모웹이미지\포근쉼터\tools\webdoc\output"
)


def main() -> None:
    dest_pages = POGEUN / "public" / "seo-data" / "pages"
    dest_pages.mkdir(parents=True, exist_ok=True)
    index_path = POGEUN / "public" / "seo-data" / "index.json"

    slugs: list[str] = []
    if index_path.is_file():
        try:
            slugs = json.loads(index_path.read_text(encoding="utf-8")).get("slugs") or []
        except (OSError, ValueError):
            slugs = []

    for pages_dir in BATCH.rglob("pages"):
        if not pages_dir.is_dir():
            continue
        for f in pages_dir.glob("*.json"):
            shutil.copy2(f, dest_pages / f.name)
            slug = f.stem
            if slug in slugs:
                slugs.remove(slug)
            slugs.insert(0, slug)
            print(f"copied {f.name}")

    index_path.write_text(
        json.dumps({"slugs": slugs, "updatedAt": __import__("datetime").datetime.utcnow().isoformat() + "Z"}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"index slugs={len(slugs)}")


if __name__ == "__main__":
    main()
