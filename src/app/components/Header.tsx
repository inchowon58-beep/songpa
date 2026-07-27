"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/#about", label: "소개" },
  { href: "/#benefits", label: "혜택" },
  { href: "/#surrender", label: "서비스" },
  { href: "/#gallery", label: "보호소" },
  { href: "/#guide", label: "절차" },
  { href: "/#articles", label: "안내글" },
] as const;

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="pogeun-phone-icon"
    >
      <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.4 21 3 13.6 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pogeun-header">
      <div className="pogeun-header-inner">
        <Link href="/" className="pogeun-logo" onClick={() => setOpen(false)}>
          <Image
            src={SITE.logo}
            alt={`${SITE.brand} 로고`}
            width={80}
            height={80}
            priority
            className="pogeun-logo-img"
          />
          <span className="pogeun-logo-text">{SITE.brand}</span>
        </Link>

        <nav className="pogeun-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pogeun-header-btns">
          <Link href="/#surrender" className="pogeun-btn-outline">
            상담안내
          </Link>
          <a href={SITE.phoneTel} className="pogeun-btn-filled">
            <PhoneIcon />
            {SITE.phone}
          </a>
        </div>

        <button
          type="button"
          className="pogeun-menu-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
        >
          <BurgerIcon />
        </button>
      </div>

      <div className={`pogeun-mobile-menu ${open ? "open" : ""}`}>
        <button
          type="button"
          className="pogeun-mobile-close"
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
        >
          <CloseIcon />
        </button>
        <nav className="pogeun-mobile-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="pogeun-mobile-btns">
          <Link href="/#surrender" className="pogeun-btn-outline" onClick={() => setOpen(false)}>
            상담안내
          </Link>
          <a href={SITE.phoneTel} className="pogeun-btn-filled" onClick={() => setOpen(false)}>
            <PhoneIcon />
            {SITE.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
