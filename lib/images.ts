/* public/images 폴더 기준 자동 생성 — 수동 수정하지 마세요 */

const ALT_PREFIXES = ["송파강아지파양 전경", "송파강아지파양 케어", "입양 대기견", "보호 시설", "무료분양 대기", "입소견"] as const;

const IMAGE_FILES = [
  "shelter-01.jpg",
  "shelter-02.png",
  "shelter-03.png",
  "shelter-04.png",
  "shelter-05.png",
  "shelter-06.png",
  "shelter-07.png",
  "shelter-08.png",
  "shelter-09.png",
  "shelter-10.png",
  "shelter-11.png",
  "shelter-12.png"
] as const;

export type ShelterImage = {
  src: string;
  alt: string;
};

export function getShelterImages(): ShelterImage[] {
  return IMAGE_FILES.map((file, index) => ({
    src: `/images/${file}`,
    alt: `${ALT_PREFIXES[index % ALT_PREFIXES.length]} — 실제 보호소 사진 ${index + 1}`,
  }));
}
