export default function FloatingBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-sand/80 bg-cream/95 backdrop-blur-md"
      role="complementary"
      aria-label="빠른 연락 바로가기"
    >
      <div className="mx-auto flex max-w-lg gap-2 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:max-w-2xl sm:gap-3 sm:px-6">
        <a
          href="https://agapetstory.co.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center rounded-full border border-sand bg-cream px-3 py-3 text-center text-xs font-medium text-charcoal transition hover:border-charcoal sm:text-sm"
        >
          아가펫홈페이지 바로가기
        </a>
        <a
          href="tel:0505-707-0401"
          className="flex flex-1 items-center justify-center rounded-full bg-charcoal px-3 py-3 text-center text-xs font-semibold text-cream transition hover:bg-aga-dark sm:text-sm"
        >
          강아지파양 전화문의
        </a>
      </div>
    </div>
  );
}
