(() => {
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "haram-shelter-seo-settings";

  let pollTimer = null;
  let lastLogLen = 0;
  let lastUrls = [];

  function setBadge(text, mode) {
    const el = $("statusBadge");
    el.textContent = text;
    el.classList.remove("warn", "busy");
    if (mode) el.classList.add(mode);
  }

  function loadSaved() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveSettings() {
    const data = {
      site_url: $("siteUrl").value.trim(),
      out_dir: $("outDir").value.trim(),
      last_keywords: $("keywords").value,
      count: $("count").value.trim(),
      chunk_size: $("chunkSize").value.trim() || "40",
      do_indexnow: $("doIndexnow").checked,
      image_url: $("imageUrl").value.trim(),
      image_count: $("imageCount").value.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setBadge("설정 저장됨", null);
  }

  function applySettings(s) {
    if (s.site_url) $("siteUrl").value = s.site_url;
    if (s.out_dir) $("outDir").value = s.out_dir;
    if (s.last_keywords) $("keywords").value = s.last_keywords;
    if (s.count != null) $("count").value = s.count;
    if (s.chunk_size != null && s.chunk_size !== "") $("chunkSize").value = s.chunk_size;
    else if (!$("chunkSize").value) $("chunkSize").value = "40";
    if (typeof s.do_indexnow === "boolean") $("doIndexnow").checked = s.do_indexnow;
    if (s.image_url) $("imageUrl").value = s.image_url;
    if (s.image_count != null && s.image_count !== "") $("imageCount").value = s.image_count;
  }

  async function copyText(text) {
    const value = (text || "").trim();
    if (!value) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  function renderUrls(urls) {
    lastUrls = Array.isArray(urls) ? urls.filter(Boolean) : [];
    const box = $("urls");
    const btn = $("btnCopyUrls");
    btn.disabled = lastUrls.length === 0;
    if (lastUrls.length === 0) {
      box.innerHTML = "";
      return;
    }
    box.innerHTML = lastUrls
      .map(
        (u, i) =>
          `<div class="url-item"><span>${u}</span><button type="button" data-i="${i}">복사</button></div>`
      )
      .join("");
    box.querySelectorAll("button[data-i]").forEach((b) => {
      b.addEventListener("click", async () => {
        const ok = await copyText(lastUrls[Number(b.dataset.i)]);
        $("urlCopyHint").textContent = ok ? "복사됨" : "복사 실패";
      });
    });
  }

  function appendLogs(logs) {
    if (!Array.isArray(logs) || logs.length <= lastLogLen) return;
    const next = logs.slice(lastLogLen);
    lastLogLen = logs.length;
    const el = $("log");
    el.textContent += (el.textContent ? "\n" : "") + next.join("\n");
    el.scrollTop = el.scrollHeight;
  }

  function setRunning(running) {
    $("btnRun").disabled = running;
    setBadge(running ? "발행 중…" : "준비됨", running ? "busy" : null);
  }

  async function pollJob() {
    try {
      const res = await fetch("/api/job");
      const data = await res.json();
      appendLogs(data.logs || []);
      if (data.result?.urls) renderUrls(data.result.urls);
      if (!data.running) {
        clearInterval(pollTimer);
        pollTimer = null;
        setRunning(false);
        if (data.error) setBadge("오류", "warn");
        else if (data.result) setBadge(`완료 · ${data.result.count || 0}건`, null);
      }
    } catch (e) {
      $("log").textContent += `\n폴링 오류: ${e}`;
    }
  }

  async function startRun() {
    saveSettings();
    $("log").textContent = "";
    lastLogLen = 0;
    renderUrls([]);
    setRunning(true);
    const body = {
      keywords: $("keywords").value,
      site_url: $("siteUrl").value.trim(),
      out_dir: $("outDir").value.trim(),
      do_indexnow: $("doIndexnow").checked,
      count: Number($("count").value) || null,
      chunk_size: Math.min(100, Math.max(1, Number($("chunkSize").value) || 40)),
      image_url: $("imageUrl").value.trim(),
      image_base: $("imageUrl").value.trim(),
      image_count: Number($("imageCount").value) || null,
    };
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setRunning(false);
      setBadge(err.detail || "시작 실패", "warn");
      return;
    }
    pollTimer = setInterval(pollJob, 700);
    pollJob();
  }

  async function init() {
    const saved = loadSaved();
    try {
      const res = await fetch("/api/meta");
      const meta = await res.json();
      // 서버(하람) 기본값을 우선 — 달빛 localStorage 잔여값으로 사이트/경로가 바뀌지 않게
      applySettings({
        ...(saved || {}),
        ...(meta.settings || {}),
        last_keywords:
          saved.last_keywords || (meta.settings && meta.settings.last_keywords) || "",
        count: saved.count != null ? saved.count : meta.settings?.count,
        chunk_size: saved.chunk_size || meta.settings?.chunk_size || "40",
        do_indexnow:
          typeof saved.do_indexnow === "boolean"
            ? saved.do_indexnow
            : meta.settings?.do_indexnow !== false,
        image_url: saved.image_url || meta.settings?.image_url,
        image_count: saved.image_count || meta.settings?.image_count,
      });
      // 사이트 URL·출력 경로는 항상 하람 서버 메타 기준
      if (meta.settings?.site_url) $("siteUrl").value = meta.settings.site_url;
      if (meta.settings?.out_dir) $("outDir").value = meta.settings.out_dir;
    } catch {
      applySettings(saved);
    }
    $("btnSave").addEventListener("click", saveSettings);
    $("btnRun").addEventListener("click", startRun);
    $("btnCopyUrls").addEventListener("click", async () => {
      const ok = await copyText(lastUrls.join("\n"));
      $("urlCopyHint").textContent = ok ? "전체 복사됨" : "복사 실패";
    });
    $("btnShutdown").addEventListener("click", async () => {
      await fetch("/api/shutdown", { method: "POST" });
      setBadge("종료 중…", "warn");
    });
  }

  init();
})();
