"use client";

import { SITE, CTA_LABEL } from "@/lib/site";

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

/** 하단 중앙 상담 CTA — PC/모바일 동일한 둥근 버튼 */
export default function FixedCallButton() {
  const label = `${CTA_LABEL} : ${SITE.phone}`;

  return (
    <div className="pogeun-floating">
      <a href={SITE.phoneTel} className="pogeun-floating-consult" aria-label={label}>
        <PhoneIcon />
        <span>{label}</span>
      </a>
    </div>
  );
}
