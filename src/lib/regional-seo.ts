import { SITE } from "./site";
import { pickImages } from "./images";
import type { SeoPage } from "./seo-pages";
import { slugifyKeyword } from "./seo-pages";

/**
 * 포근쉼터 전용 SEO 랜딩 생성기.
 * 구조(미션·서비스·보호·약속·절차·FAQ·CTA)는 유지하되,
 * 달빛쉘터와 문구·톤·섹션 제목·시드가 겹치지 않도록 전부 재작성.
 */

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function hasBatchim(word: string): boolean {
  const trimmed = word.trim();
  const last = trimmed.charAt(trimmed.length - 1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

function eunNeun(word: string): string {
  return hasBatchim(word) ? "은" : "는";
}
function eulReul(word: string): string {
  return hasBatchim(word) ? "을" : "를";
}
function gwaWa(word: string): string {
  return hasBatchim(word) ? "과" : "와";
}
function roEuro(word: string): string {
  const trimmed = word.trim();
  const last = trimmed.charAt(trimmed.length - 1);
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 === 8) return "로";
  return hasBatchim(word) ? "으로" : "로";
}

function fill(template: string, kw: string, brand: string, phone: string): string {
  return template
    .replace(/\{kw\}(는|은)/g, `${kw}${eunNeun(kw)}`)
    .replace(/\{kw\}(를|을)/g, `${kw}${eulReul(kw)}`)
    .replace(/\{kw\}(와|과)/g, `${kw}${gwaWa(kw)}`)
    .replace(/\{kw\}(로|으로)/g, `${kw}${roEuro(kw)}`)
    .replace(/\{kw\}/g, kw)
    .replace(/\{brand\}/g, brand)
    .replace(/\{phone\}/g, phone);
}

const TONE_WORDS = ["정성스럽게", "차분히", "꼼꼼히", "책임감 있게", "세심히"] as const;
const VERB_WORDS = ["안내", "상담", "확인"] as const;

const HERO_SUBTITLES = [
  "Responsible Adoption · Zero Abandoned Pets",
  "버려지는 반려동물 Zero, 책임 분양으로 이어집니다",
  "Care First, Match with Heart - {brand}",
  "파양입소부터 안심 무료분양까지 한 곳에서",
  "A Safer Next Chapter for Every Dog",
  "전국 파양입소 · 책임 있는 새 가족 매칭",
  "아이의 남은 생을 지키는 선택",
] as const;

const HERO_LINE2_POOL = [
  "책임 분양으로 이어집니다",
  "포기하지 말고 먼저 상담하세요",
  "안락한 보호와 좋은 가족을",
  "끝까지 함께 책임집니다",
  "전국 어디서나 전화 한 통이면",
] as const;

const HERO_BADGE_POOL = [
  "책임분양 · {brand}",
  "안락사 없는 보호 · {brand}",
  "전국 파양입소 · {brand}",
  "365일 전화상담 · {brand}",
] as const;

const LEAD_INS = [
  "{kw}를 앞두고 막막하시다면, 먼저 {brand}에 상황을 말씀해 주세요. 혼자 결정하지 않으셔도 됩니다.",
  "{kw}로 검색해 들어오셨다면, 직거래·방치보다 안전한 다음 선택지를 확인해 보세요.",
  "{kw}는 보호자와 아이 모두의 인생이 걸린 일입니다. {brand}가 책임 분양 기준으로 안내합니다.",
  "{kw} 문의는 신청서 없이 전화만으로 충분합니다. 전국 어디서나 동일하게 상담받으실 수 있습니다.",
  "{kw}, 급하더라도 한 번만 더 점검해 주세요. 잘못된 맡김은 아이에게 돌이킬 수 없는 상처를 남깁니다.",
] as const;

const MISSION_H2 = [
  "{kw}, 버려지지 않는 선택을 함께합니다",
  "왜 {brand}에서 {kw} 상담을 받아야 할까요",
  "{kw} 전, 반드시 알아둘 안전 기준",
  "{kw}를 고민 중인 보호자님께 드리는 안내",
  "{brand}의 책임 분양 · {kw} 안내",
  "{kw}, 아이 중심의 다음 걸음",
] as const;

const FACILITY_H2 = [
  "{kw} 후 아이가 지내는 보호 환경",
  "{brand}가 지키는 안락한 보호 기준",
  "{kw} 입소 이후의 일상 케어",
  "산책·목욕·건강관리가 이어지는 보호 공간",
] as const;

const RELATED_H2 = [
  "{kw}와 함께 검색되는 키워드",
  "{kw} 보호자님이 자주 확인하는 주제",
  "{kw} 관련 검색 의도 정리",
  "{kw} 전에 같이 보면 좋은 검색어",
] as const;

const SERVICES_H2 = [
  "{brand}가 안내하는 6가지 핵심 케어",
  "{kw}부터 매칭까지, {brand} 서비스",
  "입소·보호·분양이 이어지는 {brand} 프로세스",
] as const;

const PROMISE_TITLE_SETS = [
  ["안락하게", "투명하게", "끝까지"],
  ["안전하게", "성실히", "책임지고"],
  ["세심하게", "정직하게", "꾸준히"],
  ["신중하게", "따뜻하게", "명확하게"],
] as const;

const PROMISE_H2 = [
  "{brand}의 세 가지 책임",
  "{kw} 상담에서 지키는 약속",
  "아이 중심의 세 가지 기준",
] as const;

const PROCESS_H2 = [
  "{kw} 진행 순서 4단계",
  "처음이어도 어렵지 않은 4단계 안내",
  "{brand} {kw} 이용 절차",
] as const;

const CTA_TEMPLATES = [
  "{kw} 문의는 {phone} · {brand}",
  "파양입소·무료분양 상담 {phone}",
  "{kw}, 지금 {phone}로 책임 상담하세요 - {brand}",
  "직거래·방치 대신 {phone} · {brand}",
] as const;

const TITLE_TEMPLATES = [
  "{kw} | {brand} 책임분양·전국 파양입소 상담",
  "{kw} 안내 | {brand} - 안락사 없는 보호·무료분양",
  "{brand} {kw} - 버려지는 반려동물 Zero",
] as const;

const RELATED_SUFFIXES = [
  "보호소",
  "무료분양",
  "입양상담",
  "입소비용",
  "임시보호",
  "책임분양",
  "유기견입양",
] as const;

const GENERIC_RELATED = [
  "강아지무료분양",
  "강아지파양입소",
  "안락사없는보호소",
  "유기견보호소",
  "반려견파양상담",
] as const;

type ServiceDef = {
  key: string;
  titles: readonly string[];
  desc: (kw: string, brand: string, phone: string, tone: string) => string;
};

const SERVICE_DEFS: readonly ServiceDef[] = [
  {
    key: "counsel",
    titles: ["{kw} 전화 상담", "{kw} 사전 상담", "{kw} 상황 맞춤 상담"],
    desc: (kw, brand, phone, tone) =>
      `${kw}${eulReul(kw)} 고민 중이라면 ${brand}가 사유와 아이 상태를 ${tone} 듣고, 입소·보호·분양 중 어떤 길이 맞는지 먼저 정리해 드립니다. 문의는 ${phone}입니다.`,
  },
  {
    key: "safeIntake",
    titles: ["안전한 파양 입소", "검증된 입소 절차", "투명한 입소 안내"],
    desc: (kw, brand) =>
      `개인 직거래나 검증되지 않은 시설과 달리, ${brand}는 ${kw} 입소 절차·비용을 사전에 투명하게 안내하고 아이 중심의 보호로 연결합니다.`,
  },
  {
    key: "intakeCare",
    titles: ["안락한 입소 케어", "산책·목욕·건강 케어", "스트레스 완화 케어"],
    desc: (kw, brand, _phone, tone) =>
      `입소 후에는 산책·목욕·식사·기본 건강 확인을 ${tone} 이어가며 ${kw} 이후 아이가 겪는 불안을 줄입니다. 필요 시 생활 근황도 공유합니다.`,
  },
  {
    key: "freeAdoptionMatch",
    titles: ["책임 무료분양", "성향 맞춤 매칭", "새 가족 책임 연결"],
    desc: (kw, brand) =>
      `무료분양이어도 생활 환경·양육 의지를 확인한 뒤 매칭합니다. ${kw}로 들어온 아이가 다시 파양되지 않도록 ${brand}가 책임 분양 기준을 지킵니다.`,
  },
  {
    key: "pickup",
    titles: ["전국 방문 픽업", "일정 맞춤 이동 조율", "방문 입소 지원"],
    desc: (kw, brand) =>
      `이동이 어려운 경우 일정을 맞춰 방문 픽업을 조율합니다. ${kw} 때문에 멀리 이동하기 어려우셔도 전국 기준으로 방법을 함께 찾습니다.`,
  },
  {
    key: "afterCare",
    titles: ["사후 관리·재보호", "입양 후 안부 확인", "끝까지 책임 케어"],
    desc: (kw, brand) =>
      `매칭 후에도 안부를 확인하고, 혹여 재파양이 발생하면 다시 보호합니다. ${kw}${roEuro(kw)} 시작된 인연을 ${brand}가 끝까지 챙깁니다.`,
  },
];

type FaqDef = {
  questions: readonly string[];
  answer: (kw: string, brand: string, phone: string) => string;
};

const FAQ_DEFS: readonly FaqDef[] = [
  {
    questions: [
      "{kw} 상담은 어떻게 시작하나요?",
      "{kw} 문의 방법이 궁금해요",
      "{kw}는 어디로 연락하면 되나요?",
    ],
    answer: (kw, brand, phone) =>
      `${phone}으로 전화해 주세요. 견종·나이·건강·${kw} 사유를 말씀주시면 ${brand}가 절차와 준비 사항을 바로 안내합니다. 별도 신청서는 없습니다.`,
  },
  {
    questions: [
      "전국 어디서나 {kw}가 가능한가요?",
      "지방에서도 {kw} 상담을 받을 수 있나요?",
      "방문 없이도 {kw} 진행이 되나요?",
    ],
    answer: (kw, brand) =>
      `네. ${brand}는 특정 매장 주소에 묶이지 않고 전국 파양입소·무료분양을 안내합니다. 전화 상담 후 방문 또는 픽업 일정을 조율합니다.`,
  },
  {
    questions: [
      "무료분양은 정말 분양비가 없나요?",
      "{kw} 이후 무료분양 조건이 있나요?",
      "책임 분양은 무엇이 다른가요?",
    ],
    answer: (kw, brand) =>
      `새 가족 연결 시 별도 분양비는 받지 않습니다. 다만 재파양을 막기 위해 생활 환경과 양육 의지를 확인하는 사전 상담은 필수입니다.`,
  },
  {
    questions: [
      "개인 직거래와 무엇이 다른가요?",
      "소규모 시설에 맡기는 것보다 나은가요?",
      "{kw} 시 피해야 할 방법이 있나요?",
    ],
    answer: (kw, brand) =>
      `직거래·검증되지 않은 시설은 악용·과밀·행방 불명 위험이 큽니다. ${brand}는 입소 케어·맞춤 매칭·재보호까지 기록과 상담으로 이어갑니다.`,
  },
  {
    questions: [
      "입소 전 준비물이 필요한가요?",
      "{kw} 때 접종 기록이 있어야 하나요?",
      "서류가 꼭 필요한가요?",
    ],
    answer: (kw, brand) =>
      `필수 서류는 없습니다. 접종·진료 기록이 있으면 상담 시 알려 주시면 ${kw} 이후 케어 계획에 도움이 됩니다.`,
  },
  {
    questions: [
      "노령견·대형견도 상담 가능한가요?",
      "견종 제한이 있나요?",
      "어린 강아지도 {kw} 문의가 되나요?",
    ],
    answer: (kw, brand) =>
      `견종·나이 제한 없이 상담합니다. 소형견부터 대형견·노령견까지 상황에 맞춰 입소와 매칭을 안내합니다.`,
  },
  {
    questions: [
      "입양 후에도 연락할 수 있나요?",
      "재파양되면 어떻게 되나요?",
      "{kw} 이후 근황을 알 수 있나요?",
    ],
    answer: (kw, brand, phone) =>
      `입양 후에도 안부 확인이 가능하며, 재파양 시 다시 보호합니다. 궁금한 점은 ${phone}으로 언제든 문의해 주세요.`,
  },
];

export function generateRegionalSeoPage(keyword: string, pageIndex = 1): SeoPage {
  const kw = keyword.trim() || "강아지파양";
  const brand = SITE.brand;
  const phone = SITE.phone;
  // 달빛과 다른 시드 솔트 → 섹션 순서·문구 조합이 겹치지 않음
  const seed = hash(`${kw}|${pageIndex}|pogeun-v2|${brand}`);
  const seed2 = hash(`${kw}|${pageIndex}|pogeun-care`);
  const seed3 = hash(`${kw}|${pageIndex}|pogeun-match`);

  const tone = pick(TONE_WORDS, seed);
  const tone2 = pick(TONE_WORDS, seed2);
  const verb = pick(VERB_WORDS, seed);

  const t = (template: string) => fill(template, kw, brand, phone);

  const title = t(pick(TITLE_TEMPLATES, seed));
  const metaDescription = `${kw} - ${brand}는 버려지는 반려동물 Zero를 목표로 전국 파양입소와 책임 무료분양을 안내합니다. 직거래·방치 대신 안락한 보호와 맞춤 매칭으로 이어드립니다. 문의 ${phone}.`;
  const relatedIntents = seededShuffle(
    [...RELATED_SUFFIXES.map((s) => `${kw} ${s}`), ...GENERIC_RELATED],
    seed3
  ).slice(0, 8);
  const metaKeywords = [kw, brand, ...relatedIntents.slice(0, 6), "책임분양", "안락사없는보호소"]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 12)
    .join(", ");

  const h1 = `${kw} | ${brand} 책임분양 · 전국 파양입소`;
  const heroTitleLine1 = kw;
  const heroTitleLine2 = pick(HERO_LINE2_POOL, seed2);
  const heroBadge = t(pick(HERO_BADGE_POOL, seed3));
  const heroSubtitle = t(pick(HERO_SUBTITLES, seed));
  const heroBar = `파양입소·무료분양 문의 ${phone}`;

  const leadIn = t(pick(LEAD_INS, seed2));
  const missionSection = {
    h2: t(pick(MISSION_H2, seed)),
    paragraphs: [
      leadIn,
      `${kw}${eunNeun(kw)} ‘맡기고 끝’이 아니라, 아이가 안락하게 지내고 좋은 가족을 만날 때까지의 과정입니다. ${brand}는 보호자님의 불가피한 사정을 ${tone} 존중하면서도 아이의 안전을 최우선으로 둡니다.`,
      `이민·이사·건강·주거 문제 등으로 ${kw}${eulReul(kw)} 고민하신다면, 개인 직거래나 검증되지 않은 시설보다 먼저 전화로 절차를 ${verb}받아 보세요. 상담 신청서 없이 ${phone} 한 통이면 충분합니다.`,
      `과밀 합사·행방 불명·재유기 위험이 있는 선택은 피해야 합니다. ${brand}는 입소 케어, 성향 맞춤 무료분양, 재파양 시 재보호까지 이어지는 책임 분양으로 ${kw} 이후를 지킵니다.`,
    ],
  };

  const middleServices = seededShuffle(SERVICE_DEFS.slice(1, 5), seed);
  const orderedServices = [SERVICE_DEFS[0], ...middleServices, SERVICE_DEFS[5]];
  const services = orderedServices.map((svc, i) => ({
    title: t(pick(svc.titles, seed + i * 11)),
    description: svc.desc(kw, brand, phone, i % 2 === 0 ? tone : tone2),
  }));
  const servicesTitle = t(pick(SERVICES_H2, seed));
  const servicesIntro = `${kw} 상담 시 ${brand}가 제공하는 6가지 핵심 흐름입니다. 입소 전 상담부터 사후 관리까지 끊기지 않게 이어집니다.`;

  const facilitySection = {
    h2: t(pick(FACILITY_H2, seed2)),
    paragraphs: [
      `${brand}는 전국 파양입소·무료분양 기준으로 운영하며, ${kw} 입소가 확정되면 아이가 안정적으로 쉴 수 있는 보호 환경에서 케어를 시작합니다.`,
      `입소 후에는 산책·목욕·식사·건강 상태 확인을 ${tone} 이어가고, 성향을 파악한 뒤 책임 있는 가정과 무료분양으로 연결합니다.`,
      `보호자님이 궁금해하시는 일정·비용·이동 방법은 전화로 미리 명확히 ${verb}합니다. ${kw}${eulReul(kw)} 계기로 만난 아이가 다시 위기에 놓이지 않도록 최선을 다합니다.`,
    ],
  };

  const promiseTitles = pick(PROMISE_TITLE_SETS, seed);
  const promiseDescs = [
    `${kw} 상담부터 아이 상태와 보호자 상황을 균형 있게 듣고, 무리한 결정을 강요하지 않습니다.`,
    `입소·보호·매칭 과정을 숨기지 않고 안내하며, 궁금한 점은 ${phone}으로 언제든 확인하실 수 있습니다.`,
    `입양 후에도 안부를 확인하고, 재파양 시 다시 보호해 새 가족을 찾을 때까지 책임집니다.`,
  ];
  const promises = promiseTitles.map((title, i) => ({
    title,
    description: promiseDescs[i],
  }));
  const promisesTitle = t(pick(PROMISE_H2, seed2));

  const processTitle = t(pick(PROCESS_H2, seed3));
  const processSteps = [
    {
      step: "01",
      title: "전화 상담",
      description: `${phone}으로 ${kw} 상황을 알려 주세요. 아이 정보와 일정을 기준으로 가능한 방법을 바로 안내합니다.`,
    },
    {
      step: "02",
      title: "일정·이동 조율",
      description: `방문 입소 또는 담당자 방문 픽업 중 맞는 방식을 정합니다. 전국 어디서나 일정 조율이 가능합니다.`,
    },
    {
      step: "03",
      title: "입소·보호 케어",
      description: `입소 후 안락한 일상 케어가 시작됩니다. ${kw} 이후 스트레스 완화와 건강 확인을 함께 진행합니다.`,
    },
    {
      step: "04",
      title: "책임 분양 매칭",
      description: `성향에 맞는 가정을 연결하고, 이후에도 안부·재보호까지 지원합니다. 버려지는 반려동물 Zero를 목표로 합니다.`,
    },
  ];

  const relatedSection = {
    h2: t(pick(RELATED_H2, seed3)),
    paragraphs: [
      `${kw}${eulReul(kw)} 찾는 분들은 ${relatedIntents.slice(0, 3).join(", ")} 같은 주제도 함께 확인합니다. ${brand} 상담 시 같이 물어보시면 됩니다.`,
      `아래는 ${kw}${gwaWa(kw)} 자주 묶이는 관련 검색어입니다. SEO·상담 모두에서 실제 보호자 질문을 반영했습니다.`,
    ],
  };

  const faqCount = 6 + (seed % 2);
  const faqOrder = seededShuffle(
    FAQ_DEFS.map((_, i) => i),
    seed2
  ).slice(0, faqCount);
  const faqs = faqOrder.map((defIndex) => {
    const def = FAQ_DEFS[defIndex];
    const q = t(pick(def.questions, seed + defIndex * 5));
    return { q, a: def.answer(kw, brand, phone) };
  });

  const ctaText = t(pick(CTA_TEMPLATES, seed));
  const sections: SeoPage["sections"] = [missionSection, facilitySection, relatedSection];
  const now = new Date().toISOString();

  return {
    slug: slugifyKeyword(kw, `h${pageIndex}${seed.toString(36).slice(0, 4)}`),
    keyword: kw,
    title,
    metaDescription,
    metaKeywords,
    h1,
    heroSubtitle,
    heroBadge,
    heroTitleLine1,
    heroTitleLine2,
    heroBar,
    sections,
    faqs,
    images: pickImages(6, seed + 17),
    ctaText,
    services,
    servicesTitle,
    servicesIntro,
    promises,
    promisesTitle,
    processSteps,
    processTitle,
    relatedIntents,
    createdAt: now,
    updatedAt: now,
  };
}
