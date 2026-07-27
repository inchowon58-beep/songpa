import Link from "next/link";
import { SITE } from "@/lib/site";
import { imageUrl } from "@/lib/images";

const HERO_VIDEO_SRC = "/videos/hero.mp4";

export default function Hero() {
  const poster = imageUrl(5);

  return (
    <section className="pogeun-hero">
      <video
        className="pogeun-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="pogeun-hero-scrim" aria-hidden />

      <div className="pogeun-hero-content">
        <div className="pogeun-hero-inner">
          <span className="pogeun-hero-badge">POGEUN SHELTER</span>
          <h1 className="pogeun-hero-title">
            {SITE.brand}
            <em>따뜻한 안식처, 새 길의 시작</em>
          </h1>
          <p className="pogeun-hero-desc">
            <span>전국 어디서나 파양입소·무료분양을 한 흐름으로 안내합니다.</span>
            <span>상담부터 케어·매칭까지, 아이와 보호자 모두를 생각합니다.</span>
          </p>
          <Link href="/#surrender" className="pogeun-hero-cta">
            서비스 자세히 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
