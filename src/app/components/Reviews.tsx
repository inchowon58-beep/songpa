import { SITE } from "@/lib/site";

const REVIEWS = [
  {
    quote:
      "이사 때문에 급히 상담했는데, 파양 절차와 비용을 차분히 설명해 주셔서 안심하고 맡길 수 있었습니다.",
    name: "김○○ 보호자",
    course: "파양 입소",
  },
  {
    quote:
      "무료분양으로 아이를 만났는데 성향까지 자세히 알려주셨어요. 적응도 빨랐고 책임감이 느껴졌습니다.",
    name: "이○○ 보호자",
    course: "책임 분양",
  },
  {
    quote:
      "전국 상담이라 걱정했는데, 방문이 어려운 상황에 맞춰 픽업까지 안내해 주셨습니다.",
    name: "박○○ 보호자",
    course: "방문 픽업",
  },
  {
    quote:
      "입소 후에도 생활 사진을 보내 주셔서 마음이 놓였어요. 끝까지 챙기시는 느낌이었습니다.",
    name: "최○○ 보호자",
    course: "보호 근황",
  },
  {
    quote:
      "버리거나 직거래할까 고민하다가 포근 쉼터에 문의했습니다. 아이에게 더 좋은 선택이었다고 생각합니다.",
    name: "정○○ 보호자",
    course: "상담 후 입소",
  },
  {
    quote:
      "신청서 없이 전화만으로 안내받아 편했습니다. 급한 출국 일정도 맞춰 주셨어요.",
    name: "한○○ 보호자",
    course: "긴급 상담",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="pogeun-section pogeun-section-alt">
      <div className="pogeun-container">
        <div className="pogeun-sec-header">
          <span className="pogeun-badge">매칭 후기</span>
          <h2 className="pogeun-sec-title">
            보호자님이 남겨 주신 <em>이야기</em>
          </h2>
          <p className="pogeun-sec-desc">
            {SITE.brand}를 통해 안전한 입소와 새 가족 만남을 경험하신 분들의 후기입니다.
          </p>
        </div>

        <div className="pogeun-review-grid">
          {REVIEWS.map((r) => (
            <blockquote key={r.name + r.course} className="pogeun-review-card">
              <p className="pogeun-review-quote">&ldquo;{r.quote}&rdquo;</p>
              <footer>
                <p className="pogeun-review-name">{r.name}</p>
                <p className="pogeun-review-course">{r.course}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
