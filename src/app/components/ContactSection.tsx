import { SITE } from "@/lib/site";

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 3.6l3 1.4-1 3.4a12 12 0 0 0 6.9 6.9l3.4-1 1.4 3a2 2 0 0 1-1.4 2.6 15.5 15.5 0 0 1-16.9-16.9 2 2 0 0 1 2.6-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="pogeun-section pogeun-contact-cta">
      <div className="pogeun-container pogeun-contact-inner">
        <div>
          <p className="pogeun-contact-eyebrow">글로벌이 아닌, 전국을 잇는 상담</p>
          <h2 className="pogeun-contact-title">
            언제든 편하게
            <br />
            연락주세요
          </h2>
          <p className="pogeun-contact-desc">
            파양입소·무료분양에 관한 궁금한 점은 전화 한 통으로 해결하실 수 있습니다.
            {SITE.brand}가 전국에서 안내합니다.
          </p>
        </div>
        <a href={SITE.phoneTel} className="pogeun-contact-btn">
          <PhoneIcon />
          {SITE.phone}
        </a>
      </div>
    </section>
  );
}
