import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

function IconHeart() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-6.5-4.1-8.7-7.6C1.5 9.6 3.2 6.5 6.4 6.2c1.7-.2 3.3.6 4.1 2 0 0 .8-1.5 2.2-2.1 2.4-1.1 5.2.3 5.9 2.9.9 3.4-2.1 6.7-6.6 10.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 12h17M12 3.5c2.4 2.6 3.6 5.5 3.6 8.5s-1.2 5.9-3.6 8.5c-2.4-2.6-3.6-5.5-3.6-8.5s1.2-5.9 3.6-8.5Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconCare() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4.5 16.5V8.2L12 4.5l7.5 3.7v8.3L12 19.5 4.5 16.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 12v7.5M8.2 10.2 12 12l3.8-1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMatch() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8.5" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15.5" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.8 18.2c.8-2.4 2.8-3.7 4.7-3.7s3.9 1.3 4.7 3.7M15.5 14.5c1.7 0 3.5 1.1 4.3 3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const PROMISES: { title: string; desc: string; icon: ReactNode }[] = [
  {
    title: "전국 상담망",
    desc: "거주 지역과 무관하게 전화 한 통으로 파양입소·무료분양 흐름을 안내합니다.",
    icon: <IconGlobe />,
  },
  {
    title: "포근한 보호",
    desc: "입소 후 식사·산책·건강 확인까지 일상 케어로 안정감을 지켜 드립니다.",
    icon: <IconCare />,
  },
  {
    title: "진심 매칭",
    desc: "성향과 생활 환경을 살펴 책임 있는 새 가정을 연결합니다.",
    icon: <IconMatch />,
  },
  {
    title: "끝까지 동행",
    desc: "분양 이후에도 안부 확인과 재보호 요청에 대응하며 함께합니다.",
    icon: <IconHeart />,
  },
];

export default function About() {
  return (
    <section id="about" className="pogeun-section pogeun-section-alt">
      <div className="pogeun-container">
        <div className="pogeun-sec-header">
          <span className="pogeun-badge">서비스 소개</span>
          <h2 className="pogeun-sec-title">
            상담부터 매칭까지,
            <br />
            <em>한 흐름</em>으로 이어집니다
          </h2>
          <p className="pogeun-sec-desc">
            {SITE.brand}는 외국인 고객 유치 플랫폼처럼 ‘유입→상담→전환’을 한 축으로
            설계하듯, 파양 고민부터 무료분양 정착까지 끊기지 않는 안내를 제공합니다.
          </p>
        </div>

        <div className="pogeun-promise-list">
          {PROMISES.map((item) => (
            <div key={item.title} className="pogeun-promise-item">
              <div className="pogeun-promise-icon">{item.icon}</div>
              <p className="pogeun-promise-title">{item.title}</p>
              <p className="pogeun-promise-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
