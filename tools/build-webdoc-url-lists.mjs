/**
 * 웹문서등록요청 URL 목록 생성 (2000개씩 분할)
 * node --env-file=.env.local tools/build-webdoc-url-lists.mjs
 */
import fs from "fs";
import path from "path";

const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://songpa.cattery.co.kr"
).replace(/\/$/, "");
const OUT_DIR = path.join(process.cwd(), "웹문서등록요청");
const CHUNK = 2000;

/** 우선 견·묘종 (요청 순서). 랙돌은 랙돌고양이분양·렉돌분양 포함 */
const PRIORITY = [
  "화이트테리어분양",
  "셔틀랜드쉽독분양",
  "골든두들분양",
  "버니두들분양",
  "골든리트리버분양",
  "메인쿤분양",
  "네바마스커레이드분양",
  "랙돌고양이분양",
  "렉돌분양",
  "먼치킨분양",
];

/** 수도권 우선 지역 */
const METRO = [
  "서울",
  "강남",
  "강남구",
  "서초",
  "서초구",
  "송파",
  "강동",
  "강동구",
  "마포",
  "영등포",
  "용산",
  "종로",
  "종로구",
  "성동",
  "성동구",
  "광진구",
  "중랑",
  "중랑구",
  "성북",
  "성북구",
  "강북",
  "강북구",
  "도봉",
  "도봉구",
  "노원",
  "은평구",
  "서대문",
  "서대문구",
  "양천구",
  "강서",
  "강서구",
  "구로",
  "구로구",
  "금천구",
  "동작",
  "동작구",
  "관악구",
  "이태원",
  "홍대",
  "목동",
  "화곡",
  "마곡",
  "위례",
  "인천",
  "연수구",
  "남동구",
  "부평",
  "계양구",
  "미추홀구",
  "청라",
  "송도",
  "강화",
  "수원",
  "영통",
  "영통구",
  "권선구",
  "장안구",
  "팔달구",
  "성남",
  "분당",
  "수정구",
  "중원구",
  "고양시",
  "덕양구",
  "일산동구",
  "일산서구",
  "용인",
  "기흥",
  "처인구",
  "수지",
  "화성",
  "동탄",
  "남양주",
  "미사",
  "하남",
  "구리",
  "의정부",
  "양주",
  "파주",
  "김포",
  "부천",
  "원미구",
  "소사구",
  "광명",
  "시흥",
  "배곧",
  "안산",
  "단원구",
  "상록구",
  "안양",
  "동안구",
  "만안구",
  "군포",
  "산본",
  "의왕",
  "과천",
  "안성",
  "평택",
  "송탄",
  "오산",
  "이천",
  "여주",
  "양평",
  "포천",
  "가평",
  "연천",
  "동두천",
];

function parseQuoted(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  return [...text.matchAll(/"([^"\\]+)"/g)].map((m) => m[1]);
}

function loadRegions() {
  return parseQuoted(path.join(process.cwd(), "src/data/korea-regions.ts")).filter(
    (s) => s !== "KoreaRegion"
  );
}

function loadDefs() {
  const text = fs.readFileSync(
    path.join(process.cwd(), "src/data/breed-defs.ts"),
    "utf8"
  );
  const defs = [];
  for (const block of text.split(/\{\s*id:/).slice(1)) {
    const category = block.match(/category:\s*"([^"]+)"/)?.[1];
    const intentsBlock = block.match(/intents:\s*\[([\s\S]*?)\]/)?.[1] || "";
    const intents = [...intentsBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    if (category && intents.length) defs.push({ category, intents });
  }
  return defs;
}

function sortRegions(all) {
  const set = new Set(all);
  const metro = METRO.filter((r) => set.has(r));
  const metroSet = new Set(metro);
  const rest = all.filter((r) => !metroSet.has(r));
  return [...metro, ...rest];
}

function urlFor(category, slug) {
  const base = category === "cat" ? "goyang" : "bunyang";
  return `${SITE}/${base}/${encodeURIComponent(slug)}`;
}

const regions = sortRegions(loadRegions());
const defs = loadDefs();
const intentMeta = new Map();
for (const def of defs) {
  for (const intent of def.intents) {
    intentMeta.set(intent, def.category);
  }
}

const allIntents = [...intentMeta.keys()];
const prioritySet = new Set(PRIORITY);
const orderedIntents = [
  ...PRIORITY.filter((i) => intentMeta.has(i)),
  ...allIntents.filter((i) => !prioritySet.has(i)),
];

const urls = [];
for (const intent of orderedIntents) {
  const category = intentMeta.get(intent);
  urls.push(urlFor(category, intent));
  for (const region of regions) {
    urls.push(urlFor(category, `${region}-${intent}`));
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of fs.readdirSync(OUT_DIR)) {
  if (f.endsWith(".txt")) fs.unlinkSync(path.join(OUT_DIR, f));
}

const files = [];
for (let i = 0; i < urls.length; i += CHUNK) {
  const chunk = urls.slice(i, i + CHUNK);
  const n = String(Math.floor(i / CHUNK) + 1).padStart(2, "0");
  const name = `웹문서등록요청-${n}.txt`;
  fs.writeFileSync(path.join(OUT_DIR, name), chunk.join("\n") + "\n", "utf8");
  files.push({ name, count: chunk.length });
}

const readme = [
  "포근쉼터 웹문서등록요청 URL 목록",
  `사이트: ${SITE}`,
  `총 URL: ${urls.length}건`,
  `파일당: 최대 ${CHUNK}건`,
  `파일 수: ${files.length}개`,
  "",
  "우선 견·묘종 순서:",
  ...PRIORITY.map((p, i) => `${i + 1}. ${p}`),
  "",
  "지역: 수도권 우선 → 지방",
  "형식: 한 줄에 URL 하나",
  "",
  "파일 목록:",
  ...files.map((f) => `- ${f.name} (${f.count}건)`),
  "",
].join("\n");
fs.writeFileSync(path.join(OUT_DIR, "README.txt"), readme, "utf8");

console.log(readme);
console.log("--- sample (파일1 앞부분) ---");
console.log(urls.slice(0, 8).join("\n"));
