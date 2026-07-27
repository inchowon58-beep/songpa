"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { HOME_FAQS } from "@/lib/faq-data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="pogeun-section">
      <div className="pogeun-container" style={{ maxWidth: "820px" }}>
        <div className="pogeun-sec-header">
          <span className="pogeun-badge">FAQ</span>
          <h2 className="pogeun-sec-title">
            자주 묻는 <em>질문</em>
          </h2>
          <p className="pogeun-sec-desc">
            강아지파양·무료분양에 대해 자주 묻는 질문입니다.{" "}
            <a href={SITE.phoneTel} style={{ color: "var(--color)", fontWeight: 700 }}>
              {SITE.phone}
            </a>
          </p>
        </div>

        <div className="pogeun-faq-list">
          {HOME_FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="pogeun-faq-item">
                <button
                  type="button"
                  className="pogeun-faq-q"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                >
                  <span>{item.q}</span>
                  <span className="pogeun-faq-icon">{open ? "−" : "+"}</span>
                </button>
                {open && <div className="pogeun-faq-a">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
