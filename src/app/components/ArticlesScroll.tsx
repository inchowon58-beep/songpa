import Link from "next/link";
import type { SeoPage } from "@/lib/seo-pages";
import { pagePath } from "@/lib/seo-pages";

const MAIN_PREVIEW = 5;

export default function ArticlesScroll({ pages }: { pages: SeoPage[] }) {
  const preview = pages.slice(0, MAIN_PREVIEW);

  if (!preview.length) {
    return (
      <section id="articles" className="pogeun-section pogeun-section-alt scroll-mt-28">
        <div className="pogeun-container">
          <div className="pogeun-sec-header align-left">
            <span className="pogeun-badge">Notice</span>
            <h2 className="pogeun-sec-title">
              <Link href="/guide">
                강아지 파양·분양 <em>안내글</em>
              </Link>
            </h2>
            <p className="pogeun-sec-desc">발행된 안내 글이 여기에 노출됩니다.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="pogeun-section pogeun-section-alt scroll-mt-28">
      <div className="pogeun-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="pogeun-sec-header align-left">
            <span className="pogeun-badge">Notice</span>
            <h2 className="pogeun-sec-title">
              <Link href="/guide">
                강아지 파양·분양 <em>안내글</em>
              </Link>
            </h2>
          </div>
          <Link href="/guide" className="pogeun-btn-outline shrink-0">
            전체 목록 보기 →
          </Link>
        </div>

        <div className="pogeun-news-list">
          {preview.map((p, i) => (
            <Link key={p.slug} href={pagePath(p.slug)} className="pogeun-news-item">
              <span className="pogeun-news-num">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <span className="pogeun-news-tag">{p.keyword}</span>
                <h3 className="pogeun-news-title">{p.h1}</h3>
                <p className="pogeun-news-desc line-clamp-2">{p.metaDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
