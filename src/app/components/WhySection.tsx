import { SITE } from "@/lib/site";

/** K-Beauty Station 혜택/입점 구성 참고 — 보호소 혜택으로 재해석 */
const BENEFITS = [
  {
    title: "실시간 전화 상담",
    desc: "상황 설명만으로도 입소·분양 가능 여부를 빠르게 안내합니다. 복잡한 신청서 없이 시작하세요.",
  },
  {
    title: "다지역 연계 케어",
    desc: "전국 단위로 이동·픽업·입소 일정을 조율해, 멀리 있어도 부담을 줄입니다.",
  },
  {
    title: "투명한 절차 안내",
    desc: "비용·준비물·케어 범위를 상담 단계에서 명확히 공유합니다.",
  },
  {
    title: "책임 분양 전환",
    desc: "단순 위탁이 아니라 새 가정 매칭과 사후 안부까지 이어지는 구조입니다.",
  },
  {
    title: "재보호 안전망",
    desc: "부득이한 재파양 시에도 다시 맡아 다음 가정을 찾을 때까지 지원합니다.",
  },
] as const;

export default function WhySection() {
  return (
    <section id="benefits" className="pogeun-section pogeun-why">
      <div className="pogeun-container">
        <div className="pogeun-sec-header">
          <span className="pogeun-badge">BENEFIT</span>
          <h2 className="pogeun-sec-title">
            {SITE.brand}가 드리는
            <br />
            <em>다섯 가지 밀착 케어</em>
          </h2>
          <p className="pogeun-sec-desc">
            유입부터 전환까지 — 보호자와 아이 모두가 덜 아프도록 설계한 안내 패키지입니다.
          </p>
        </div>

        <div className="pogeun-why-grid pogeun-benefit-grid">
          {BENEFITS.map((item, i) => (
            <article key={item.title} className="pogeun-why-card">
              <span className="pogeun-why-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="pogeun-why-note">
          <p>
            지금 바로 상담이 필요하시다면{" "}
            <strong>{SITE.phone}</strong>으로 연락 주세요. 전국 어디서나 가능합니다.
          </p>
          <a href={SITE.phoneTel} className="pogeun-btn-main">
            전화 상담하기
          </a>
        </div>
      </div>
    </section>
  );
}
