/** 포근쉼터 — 전국 강아지 파양입소 · 무료분양 보호소 사이트 공통 설정 */

export const SITE = {
  name: "포근 쉼터",
  nameEn: "Pogeun Shelter",
  brand: "포근 쉼터",
  brandEn: "Pogeun Shelter",
  tagline: "따뜻한 안식처에서, 새 가족의 시작까지",
  taglineEn: "Nationwide Dog Surrender & Free Adoption Shelter",
  description:
    "포근 쉼터는 전국 강아지 파양입소와 무료분양을 안내하는 보호소입니다. 상담부터 입소·케어·새 가족 매칭까지 한 번에 이어 드립니다. 문의 010-9906-4068.",
  keywords: [
    "강아지파양",
    "포근쉼터",
    "포근 쉼터",
    "강아지파양입소",
    "무료분양",
    "강아지무료분양",
    "유기견보호소",
    "강아지보호소",
    "전국파양입소",
    "강아지입양",
    "반려견파양",
    "강아지입소",
    "새가족매칭",
    "강아지분양",
    "유기견입양",
  ],
  phone: "010-9906-4068",
  phoneTel: "tel:01099064068",
  email: "",
  logo: "/logo.png",
  imageBase: "https://image.cattery.co.kr/dogboho",
  imageCount: 79,
  areaServed: "대한민국 전국",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://songpa.cattery.co.kr",
} as const;

export const CTA_LABEL = "파양입소·무료분양 문의";
export const CTA_LABEL_CALL = "전화상담";
