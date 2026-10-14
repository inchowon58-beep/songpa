"use client";

import { usePathname } from "next/navigation";
import { SITE, CTA_LABEL } from "@/lib/site";
import { BREED_PHONE, BREED_PHONE_TEL } from "@/lib/breed-catalog";

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

/** 하단 중앙 상담 CTA — 분양 경로에서는 0505 번호 */
export default function FixedCallButton() {
  const pathname = usePathname() || "";
  const isBreed =
    pathname.startsWith("/bunyang") || pathname.startsWith("/goyang");
  const phone = isBreed ? BREED_PHONE : SITE.phone;
  const href = isBreed ? BREED_PHONE_TEL : SITE.phoneTel;
  const label = isBreed
    ? `강아지·고양이 분양 문의 : ${phone}`
    : `${CTA_LABEL} : ${phone}`;

  return (
    <div className="pogeun-floating">
      <a href={href} className="pogeun-floating-consult" aria-label={label}>
        <PhoneIcon />
        <span>{label}</span>
      </a>
    </div>
  );
}
