import Image from "next/image";
import { SITE } from "@/lib/site";
import { imageUrl } from "@/lib/images";

const SURRENDER_CARDS = [
  {
    title: "파양입소 연계",
    tag: "INBOUND",
    image: 2,
    description:
      "이사·건강·주거 변화 등 피치 못한 사정의 입소를 상담합니다. 전국 일정 조율과 준비 사항을 단계별로 안내합니다.",
  },
  {
    title: "일상 보호 케어",
    tag: "CARE",
    image: 8,
    description:
      "깨끗한 공간과 규칙적인 식사·산책·건강 확인으로 포근한 일상을 이어 갑니다. 필요 시 생활 근황도 공유합니다.",
  },
  {
    title: "무료분양 매칭",
    tag: "MATCH",
    image: 12,
    description:
      "성향·생활 환경에 맞는 책임 가정과 연결합니다. 입양 후에도 정착을 돕는 안부 확인을 이어갑니다.",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "문의·상담",
    desc: "전화로 아이 정보와 상황을 알려 주세요. 비밀 보장 하에 차분히 상담합니다.",
  },
  {
    step: "02",
    title: "맞춤 안내",
    desc: "입소·보호·분양 중 어떤 길이 맞는지, 일정과 준비물을 상황에 맞게 설명합니다.",
  },
  {
    step: "03",
    title: "입소·안정",
    desc: "입소 후 정서 안정과 일상 케어가 시작됩니다. 포근한 공간에서 회복을 돕습니다.",
  },
  {
    step: "04",
    title: "새 가족 연결",
    desc: "준비가 되면 책임 있는 가정에 무료분양을 연계하고, 이후에도 안부를 확인합니다.",
  },
] as const;

export default function Services() {
  return (
    <section id="surrender" className="pogeun-section">
      <div className="pogeun-container">
        <div className="pogeun-sec-header">
          <span className="pogeun-badge">카테고리</span>
          <h2 className="pogeun-sec-title">
            보호의 여정을
            <br />
            <em>하나로 연결</em>합니다
          </h2>
          <p className="pogeun-sec-desc">
            상담·입소·케어·분양이 흩어지지 않도록, {SITE.brand}가 전 과정을 이어 드립니다.
          </p>
        </div>

        <div className="pogeun-card-list">
          {SURRENDER_CARDS.map((card) => (
            <article key={card.title} className="pogeun-card">
              <div className="pogeun-card-thumb">
                <Image src={imageUrl(card.image)} alt={card.title} fill className="object-cover" />
                <span className="pogeun-card-badge">{card.tag}</span>
              </div>
              <div className="pogeun-card-info">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="pogeun-cta-row">
          <div>
            <p className="pogeun-cta-row-title">파양입소 · 무료분양 문의</p>
            <p className="pogeun-cta-row-desc">
              {SITE.phone} — 연중무휴 전화 상담
            </p>
          </div>
          <a href={SITE.phoneTel} className="pogeun-btn-main">
            지금 연결하기
          </a>
        </div>
      </div>
    </section>
  );
}

export function GuideSection() {
  return (
    <section id="guide" className="pogeun-section pogeun-section-alt">
      <div className="pogeun-container">
        <div className="pogeun-sec-header">
          <span className="pogeun-badge">이용 절차</span>
          <h2 className="pogeun-sec-title">
            처음이라도 <em>차근차근</em>
          </h2>
          <p className="pogeun-sec-desc">
            신중하고 투명한 4단계로, 부담 없이 다음 걸음을 내딛을 수 있습니다.
          </p>
        </div>

        <ol className="pogeun-step-list">
          {STEPS.map((step) => (
            <li key={step.step} className="pogeun-step-item">
              <span className="pogeun-step-num">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
