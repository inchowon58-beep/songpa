import fs from "fs";
import os from "os";
import path from "path";
import { get, list, put } from "@vercel/blob";
import { SITE } from "./site";

export type FaqItem = { q: string; a: string };

export type SeoPage = {
  slug: string;
  keyword: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  h1: string;
  heroSubtitle: string;
  heroBadge?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroBar?: string;
  sections: {
    h2: string;
    paragraphs: string[];
  }[];
  faqs: FaqItem[];
  images: string[];
  ctaText: string;
  createdAt: string;
  updatedAt: string;
  /** 핵심 서비스 6종 (파양상담·보호소연계·입소케어·무료분양매칭·방문픽업·사후안내) */
  services?: { title: string; description: string }[];
  /** 핵심 서비스 섹션 제목 / 리드 문장 */
  servicesTitle?: string;
  servicesIntro?: string;
  /** 세 가지 약속 */
  promises?: { title: string; description: string }[];
  promisesTitle?: string;
  /** 4단계 절차 */
  processSteps?: { step: string; title: string; description: string }[];
  processTitle?: string;
  /** 관련 검색 의도 / 함께 찾는 키워드 */
  relatedIntents?: string[];
};

export type SeoIndex = {
  slugs: string[];
  updatedAt: string;
};

/** 사이트 전용 Blob 경로 — 다른 보호소와 토큰 혼용 시에도 충돌 방지 */
const BLOB_PREFIX = "pogeun-seo-data";

/** Vercel Blob 스토어는 private로 사용 */
const BLOB_ACCESS = "private" as const;

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

function resolveBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return process.env.BLOB_READ_WRITE_TOKEN.trim();
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (
      value?.trim() &&
      key.includes("BLOB") &&
      key.endsWith("READ_WRITE_TOKEN")
    ) {
      return value.trim();
    }
  }
  return undefined;
}

function blobTokenOpts() {
  const token = resolveBlobToken();
  return token ? { token } : {};
}

function blobOpts() {
  return {
    access: BLOB_ACCESS,
    ...blobTokenOpts(),
  };
}

function blobPutOpts() {
  return {
    ...blobOpts(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  };
}

function preferredDataDir() {
  return path.join(process.cwd(), "public", "seo-data");
}

function fallbackDataDir() {
  return path.join(os.tmpdir(), "pogeun-shelter", "seo-data");
}

function resolveDataDir() {
  const preferred = preferredDataDir();
  try {
    fs.mkdirSync(path.join(preferred, "pages"), { recursive: true });
    return preferred;
  } catch {
    const fallback = fallbackDataDir();
    fs.mkdirSync(path.join(fallback, "pages"), { recursive: true });
    return fallback;
  }
}

function pagesDir() {
  return path.join(resolveDataDir(), "pages");
}

function indexPath() {
  return path.join(resolveDataDir(), "index.json");
}

function ensureDirs() {
  fs.mkdirSync(pagesDir(), { recursive: true });
}

async function streamToText(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder("utf-8").decode(merged);
}

async function readBlobText(pathname: string): Promise<string | null> {
  const opts = blobOpts();
  try {
    const result = await get(pathname, opts);
    if (result?.stream) {
      return await streamToText(result.stream);
    }
  } catch (e) {
    console.error("[seo-pages] blob get failed", pathname, e);
  }

  try {
    const { blobs } = await list({
      prefix: pathname,
      ...blobTokenOpts(),
    });
    const match =
      blobs.find((b) => b.pathname === pathname) ||
      blobs.find((b) => b.pathname.endsWith(`/${path.basename(pathname)}`));
    if (!match) return null;
    const viaGet = await get(match.url, opts);
    if (viaGet?.stream) return await streamToText(viaGet.stream);
  } catch (e) {
    console.error("[seo-pages] blob list/get failed", pathname, e);
  }
  return null;
}

async function writeBlobText(pathname: string, content: string): Promise<void> {
  await put(pathname, content, blobPutOpts());
}

function readIndexFs(): SeoIndex {
  const file = indexPath();
  ensureDirs();
  if (!fs.existsSync(file)) {
    return { slugs: [], updatedAt: new Date().toISOString() };
  }
  try {
    const raw = fs.readFileSync(file, "utf-8").replace(/^\uFEFF/, "");
    return JSON.parse(raw) as SeoIndex;
  } catch {
    return { slugs: [], updatedAt: new Date().toISOString() };
  }
}

function writeIndexFs(index: SeoIndex) {
  const file = indexPath();
  ensureDirs();
  fs.writeFileSync(file, JSON.stringify(index, null, 2), "utf-8");
}

function readPageFs(slug: string): SeoPage | null {
  const dir = pagesDir();
  const candidates = [slug];
  try {
    const decoded = decodeURIComponent(slug);
    if (decoded !== slug) candidates.push(decoded);
  } catch {
    /* ignore */
  }
  for (const key of candidates) {
    const file = path.join(dir, `${key}.json`);
    if (!fs.existsSync(file)) continue;
    try {
      const raw = fs.readFileSync(file, "utf-8").replace(/^\uFEFF/, "");
      return JSON.parse(raw) as SeoPage;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function readIndex(): Promise<SeoIndex> {
  if (resolveBlobToken() || isVercelRuntime()) {
    const blobRaw = await readBlobText(`${BLOB_PREFIX}/index.json`);
    if (blobRaw) {
      try {
        return JSON.parse(blobRaw) as SeoIndex;
      } catch {
        /* fall through */
      }
    }
  }
  return readIndexFs();
}

export async function writeIndex(index: SeoIndex): Promise<void> {
  const content = JSON.stringify(index, null, 2);
  if (isVercelRuntime() || resolveBlobToken()) {
    try {
      await writeBlobText(`${BLOB_PREFIX}/index.json`, content);
      if (!isVercelRuntime()) {
        try {
          writeIndexFs(index);
        } catch {
          /* optional local mirror */
        }
      }
      return;
    } catch (e) {
      if (isVercelRuntime()) {
        throw new Error(
          `Vercel Blob 저장 실패(index). private 스토어는 access:'private'이 필요합니다. (${
            e instanceof Error ? e.message : e
          })`
        );
      }
    }
  }
  try {
    writeIndexFs(index);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/EROFS|read-only/i.test(msg)) {
      throw new Error(
        "배포 환경은 파일 쓰기가 불가합니다. Vercel Blob 토큰을 설정하세요."
      );
    }
    throw e;
  }
}

export async function readPage(slug: string): Promise<SeoPage | null> {
  const candidates = [slug];
  try {
    const decoded = decodeURIComponent(slug);
    if (decoded !== slug) candidates.push(decoded);
  } catch {
    /* ignore */
  }
  if (resolveBlobToken() || isVercelRuntime()) {
    for (const key of candidates) {
      const blobRaw = await readBlobText(`${BLOB_PREFIX}/pages/${key}.json`);
      if (blobRaw) {
        try {
          return JSON.parse(blobRaw) as SeoPage;
        } catch {
          /* try next */
        }
      }
    }
  }
  return readPageFs(slug);
}

async function listBlobPageSlugs(): Promise<string[]> {
  if (!(resolveBlobToken() || isVercelRuntime())) return [];
  try {
    const found: string[] = [];
    let cursor: string | undefined;
    do {
      const result = await list({
        prefix: `${BLOB_PREFIX}/pages/`,
        cursor,
        ...blobTokenOpts(),
      });
      for (const b of result.blobs) {
        const m = b.pathname.match(/\/pages\/(.+)\.json$/);
        if (!m?.[1]) continue;
        try {
          found.push(decodeURIComponent(m[1]));
        } catch {
          found.push(m[1]);
        }
      }
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    return found;
  } catch (e) {
    console.error("[seo-pages] blob list pages failed", e);
    return [];
  }
}

export async function listPages(): Promise<SeoPage[]> {
  const { slugs } = await readIndex();
  const ordered: string[] = [...slugs];
  const seen = new Set(ordered);

  // index 누락분 보완 — 관리자 발행 후 index 반영 실패·지연 시에도 목록에 나오게
  for (const s of await listBlobPageSlugs()) {
    if (!seen.has(s)) {
      ordered.unshift(s);
      seen.add(s);
    }
  }

  const pages: SeoPage[] = [];
  const loaded = new Set<string>();
  for (const s of ordered) {
    const p = await readPage(s);
    if (p && !loaded.has(p.slug)) {
      pages.push(p);
      loaded.add(p.slug);
    }
  }

  if (pages.length === 0) {
    const dir = pagesDir();
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
      for (const f of files) {
        const p = readPageFs(f.replace(/\.json$/, ""));
        if (p && !loaded.has(p.slug)) {
          pages.push(p);
          loaded.add(p.slug);
        }
      }
    }
  }

  // index 가 실제 페이지보다 뒤처져 있으면 복구
  if (pages.length > 0) {
    const healed = pages.map((p) => p.slug);
    const same =
      healed.length === slugs.length && healed.every((s, i) => s === slugs[i]);
    if (!same) {
      try {
        await writeIndex({
          slugs: healed,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error("[seo-pages] index heal failed", e);
      }
    }
  }

  return pages.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function savePage(page: SeoPage): Promise<void> {
  const content = JSON.stringify(page, null, 2);
  const pagePathname = `${BLOB_PREFIX}/pages/${page.slug}.json`;

  if (isVercelRuntime()) {
    try {
      await writeBlobText(pagePathname, content);
    } catch (e) {
      throw new Error(
        `Vercel Blob 저장 실패. private Blob은 access:'private'로 저장합니다. 토큰·Redeploy를 확인하세요. (${
          e instanceof Error ? e.message : e
        })`
      );
    }
  } else {
    try {
      ensureDirs();
      fs.writeFileSync(
        path.join(pagesDir(), `${page.slug}.json`),
        content,
        "utf-8"
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/EROFS|read-only/i.test(msg)) {
        throw new Error(
          "파일 시스템이 읽기 전용입니다. Vercel Blob을 설정하거나 로컬에서 발행하세요."
        );
      }
      throw e;
    }
    if (resolveBlobToken()) {
      try {
        await writeBlobText(pagePathname, content);
      } catch (e) {
        // 로컬에서도 토큰이 있으면 Blob 반영 실패를 숨기지 않음 — 목록 누락 원인
        throw new Error(
          `Blob 동기화 실패: ${e instanceof Error ? e.message : e}`
        );
      }
    }
  }

  const index = await readIndex();
  // 새 글을 항상 맨 앞으로 (이미 있어도 재정렬)
  index.slugs = [page.slug, ...index.slugs.filter((s) => s !== page.slug)];
  index.updatedAt = new Date().toISOString();
  await writeIndex(index);

  // 저장 직후 읽기 검증 — 실패 시 즉시 에러로 관리자에 표시
  const verify = await readPage(page.slug);
  if (!verify) {
    throw new Error(
      `문서는 저장됐지만 바로 읽히지 않습니다 (slug: ${page.slug}). Blob 경로(${BLOB_PREFIX})·토큰을 확인하세요.`
    );
  }
}

export function pagePublicUrl(slug: string): string {
  return `${SITE.siteUrl}/guide/${encodeURIComponent(slug)}`;
}

export function pagePath(slug: string): string {
  return `/guide/${encodeURIComponent(slug)}`;
}

/** 파일명용 slug */
export function slugifyKeyword(keyword: string, salt?: string): string {
  const base = keyword
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣\-]/g, "")
    .slice(0, 40);
  const tail =
    salt ||
    Math.random().toString(36).slice(2, 6) +
      Date.now().toString(36).slice(-4);
  return `${base || "gangaji-gyobae"}-${tail}`;
}
