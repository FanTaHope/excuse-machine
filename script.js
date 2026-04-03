// currentLang 은 i18n.js에서 이미 선언됨

const TAGLINES = [
  "다수의 전문가들이 인정할 가능성이 있습니다.",
  "이 결과는 어딘가에서 이미 검증됐을 가능성이 높습니다.",
  "관련 분야 전문가들이 고개를 끄덕였을 것으로 추정됩니다.",
  "이 이유는 과학적으로 틀리지 않을 가능성이 있습니다.",
  "전 세계 어딘가의 연구기관이 같은 결론에 도달했을 수 있습니다.",
  "이 판단은 합리적인 근거에 의한 것으로 알려져 있습니다.",
  "논리적으로 반박하기 어려운 것으로 알려져 있습니다.",
  "이 판단에 이의를 제기하는 사람은 많지 않을 것으로 예상됩니다.",
  "노벨 핑계상 수상 후보에 오를 가능성이 없지 않습니다.",
  "이 이유는 빅데이터 0.3개를 기반으로 산출됐을 가능성이 있습니다.",
  "이 판단은 비공개 전문가 심사위원회를 통과했을 가능성이 있습니다.",
  "반증 데이터는 아직 발견되지 않은 것으로 알려져 있습니다.",
  "AI 3개에게 물어봤으며 모두 동의했을 가능성이 있습니다.",
  "이 판단은 내부적으로 수차례 검토됐을 것으로 알려져 있습니다.",
  "철학적으로도, 과학적으로도, 직감적으로도 맞을 가능성이 있습니다.",
  "이 결과를 의심하는 것은 자유이나 소용은 없을 것으로 추정됩니다.",
];

// 저장된 언어 복원
const savedLang = localStorage.getItem("excuse-lang");
if (savedLang && I18N[savedLang]) {
  currentLang = savedLang;
}

// 초기 태그라인
const initTaglines = I18N[currentLang].taglines || TAGLINES;
document.getElementById('taglineRandom').textContent =
  initTaglines[Math.floor(Math.random() * initTaglines.length)];

const input = document.getElementById("actionInput");
const btnCant = document.getElementById("btnCant");
const btnMust = document.getElementById("btnMust");
const resultArea = document.getElementById("resultArea");
const card = document.getElementById("resultCard");
const toast = document.getElementById("toast");
const charCount = document.getElementById("charCount");

let lastType = null;
let toastTimer = null;

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showToast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function setLang(lang) {
  currentLang = lang;
  const t = I18N[lang];

  // 언어 선택 저장
  localStorage.setItem("excuse-lang", lang);

  // html lang 속성 업데이트
  document.documentElement.lang = lang;

  // 언어별 폰트 전환 (본문)
  const fontMap = {
    ko: "'Noto Sans KR', sans-serif",
    en: "'Noto Sans KR', sans-serif",
    ja: "'Noto Sans JP', 'Noto Sans KR', sans-serif",
    zh: "'Noto Sans SC', 'Noto Sans KR', sans-serif",
  };
  document.body.style.fontFamily = fontMap[lang] || fontMap.ko;

  // 언어별 디스플레이 폰트 전환 (로고, 헤드라인)
  const displayFontMap = {
    ko: "'Black Han Sans', sans-serif",
    en: "'Black Han Sans', 'Arial Black', sans-serif",
    ja: "'Noto Sans JP', sans-serif",
    zh: "'Noto Sans SC', sans-serif",
  };
  const displayFont = displayFontMap[lang] || displayFontMap.ko;
  document.querySelector(".logo-text").style.fontFamily = displayFont;
  document.querySelector(".headline").style.fontFamily = displayFont;

  // 언어 버튼 활성화 상태 업데이트
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // 베타 경고 표시/숨김
  const betaEl = document.getElementById("langBetaWarning");
  const betaText = document.getElementById("langBetaText");
  if (t.betaWarning) {
    betaEl.style.display = "";
    betaText.textContent = t.betaWarning;
  } else {
    betaEl.style.display = "none";
  }

  // UI 텍스트 전환
  document.querySelector(".logo-text").textContent = t.logoText;
  document.querySelector(".badge").innerHTML =
    '<span class="badge-dot"></span>' + t.badge;
  document.querySelector(".headline").innerHTML = t.headline;
  document.querySelector(".sub").textContent = t.sub;
  document.querySelector(".tagline-fixed").textContent = t.taglineFixed;
  document.getElementById("actionInput").placeholder = t.placeholder;
  document.getElementById("btnCant").innerHTML = t.btnCant;
  document.getElementById("btnMust").innerHTML = t.btnMust;
  document.querySelector(".capture-hint").textContent = t.captureHint;
  document.querySelector(".footer").innerHTML = t.footer;

  // 배너 텍스트 전환
  const leftTitle = document.querySelector(".banner-title");
  if (leftTitle) leftTitle.innerHTML = t.bannerLeftTitle;
  const leftBody = document.querySelector(".side-left .banner-body");
  if (leftBody) leftBody.innerHTML = t.bannerLeftBody;
  const leftStamp = document.querySelector(".banner-stamp");
  if (leftStamp) leftStamp.innerHTML = t.bannerLeftStamp;
  const rightHeadline = document.querySelector(".banner-ad-headline");
  if (rightHeadline) rightHeadline.innerHTML = t.bannerRightHeadline;
  const rightBody = document.querySelector(".side-right .banner-body");
  if (rightBody) rightBody.innerHTML = t.bannerRightBody;
  const rightCta = document.querySelector(".banner-cta");
  if (rightCta) rightCta.textContent = t.bannerRightCta;

  // 액션 버튼 텍스트 전환
  const actionBtns = document.querySelectorAll(".btn-action");
  actionBtns.forEach(btn => {
    const onclick = btn.getAttribute("onclick") || "";
    if (onclick.includes("reroll")) btn.textContent = t.btnReroll;
    else if (onclick.includes("resetInput")) btn.textContent = t.btnReset;
    else if (onclick.includes("saveAsImage")) btn.textContent = t.btnSave;
    else if (onclick.includes("shareCard")) btn.textContent = t.btnShare;
  });

  // 카드 헤더
  document.querySelector(".card-header-left").textContent = t.cardHeader;

  // 결과 카드가 표시 중이면 숨기기
  resultArea.classList.remove("visible");

  // 태그라인 랜덤 재선택 (언어별)
  const taglines = t.taglines || TAGLINES;
  document.getElementById("taglineRandom").textContent =
    taglines[Math.floor(Math.random() * taglines.length)];
}

// 입력값 변경 → 버튼 활성화/비활성화 + 글자 수
input.addEventListener("input", () => {
  const hasValue = input.value.trim().length > 0;
  btnCant.disabled = !hasValue;
  btnMust.disabled = !hasValue;
  charCount.textContent = input.value.length;
});

function addJosa(word) {
  const last = word.charCodeAt(word.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return word + "을(를)";
  return (last - 0xac00) % 28 === 0 ? word + "를" : word + "을";
}

function addParticle(word, lang) {
  if (lang === "korean" || !lang) return addJosa(word);

  if (lang === "japanese") {
    const last = word[word.length - 1];
    if (["を", "が", "は", "に", "で"].includes(last)) return word;
    return word + "を";
  }

  if (lang === "english") {
    return "your " + word;
  }

  // 중국어: 조사 없음
  return word;
}

// ── 안전 필터 ──────────────────────────────────────────

const DANGER_KEYWORDS_A = [
  "자살", "자해", "죽고싶다", "죽고 싶다", "죽어야", "죽어버려야",
  "목숨끊기", "목숨을끊기", "목숨을 끊기", "생을마감", "생을 마감",
  "극단적선택", "극단적 선택", "스스로목숨", "스스로 목숨",
  "없어져야", "없어지고싶다", "없어지고 싶다", "사라져야",
  "세상을떠나야", "세상을 떠나야", "이세상떠나기", "이 세상 떠나기",
  "살기싫다", "살기 싫다", "살고싶지않다", "살고 싶지 않다",
  "손목긋기", "손목 긋기", "자해하기", "스스로를해치기", "스스로를 해치기",
  "목매기", "목매달기", "투신하기", "투신", "음독하기", "음독",
  "약먹고죽기", "약을먹고죽기", "뛰어내리기", "뛰어내려야",
  "한강가기", "옥상가기", "죽는법", "죽는방법", "죽는 법", "죽는 방법",
  "죽고파", "죽고 파", "그냥죽어야", "그냥 죽어야",
  "차에치이기", "이제그만살기", "이제 그만 살기",
  "숨고싶다", "숨고 싶다", "다사라지고싶어", "다 사라지고 싶어"
];

const DANGER_KEYWORDS_B = [
  "살인", "살해", "살인하기", "사람죽이기", "사람을죽이기", "사람죽여야",
  "폭행", "폭행하기", "폭력", "폭력행사", "구타", "구타하기",
  "때리기", "때려죽이기", "패기", "패버리기", "두들겨패기",
  "주먹질", "주먹질하기", "발길질", "발길질하기",
  "집단폭행", "집단폭력", "린치", "보복폭행",
  "칼로찌르기", "흉기휘두르기",
  "납치하기", "감금하기", "사람을해치기", "협박하기",
  "테러하기", "방화하기", "방화", "불지르기",
  "성폭행", "성추행", "몰카찍기", "불법촬영", "강간",
  "강도하기", "강도질", "절도하기", "도둑질", "사기치기",
  "횡령하기", "갈취하기", "금품갈취",
  "마약하기", "마약먹기", "마약투약", "도박하기", "불법도박",
  "마약팔기", "마약구하기",
  "해킹하기", "개인정보훔치기", "스토킹하기", "아동학대",
  "죽여야", "죽여버려야", "을죽여야", "를죽여야"
];

const NEGATION_PATTERNS = [
  "안 하기", "안하기", "하지 않기", "하지않기",
  "하지 말기", "하지말기", "안 함", "안함",
  "하지 않는", "안 하는", "안하는", "하지않는",
  "그만하기", "멈추기", "중단하기", "끊기"
];

function normalize(text) {
  return text.replace(/\s/g, "");
}

function hasNegation(text) {
  const norm = normalize(text);
  const lower = text.toLowerCase();
  const normLower = norm.toLowerCase();
  // 한국어 기본 부정형
  for (const pat of NEGATION_PATTERNS) {
    if (text.includes(pat) || norm.includes(normalize(pat))) return true;
  }
  // 현재 언어 부정형
  const langNeg = I18N[currentLang].negationPatterns || [];
  for (const pat of langNeg) {
    const p = pat.toLowerCase();
    if (lower.includes(p) || normLower.includes(normalize(p).toLowerCase())) return true;
  }
  return false;
}

function checkDangerCategory(text) {
  const norm = normalize(text);
  const lower = text.toLowerCase();
  const normLower = norm.toLowerCase();
  // 한국어 기본 키워드
  for (const kw of DANGER_KEYWORDS_A) {
    if (text.includes(kw) || norm.includes(normalize(kw))) return "A";
  }
  for (const kw of DANGER_KEYWORDS_B) {
    if (text.includes(kw) || norm.includes(normalize(kw))) return "B";
  }
  // 현재 언어 키워드
  const langA = I18N[currentLang].dangerKeywordsA || [];
  const langB = I18N[currentLang].dangerKeywordsB || [];
  for (const kw of langA) {
    const k = kw.toLowerCase();
    if (lower.includes(k) || normLower.includes(normalize(k).toLowerCase())) return "A";
  }
  for (const kw of langB) {
    const k = kw.toLowerCase();
    if (lower.includes(k) || normLower.includes(normalize(k).toLowerCase())) return "B";
  }
  return null;
}

// 위험 카드 공통 렌더링
function showDangerCard(action, opts) {
  const t = I18N[currentLang];
  const actionDisplay = addParticle(action, t.josaMode);

  document.querySelector(".card-sentence").innerHTML =
    t.cardIntro + ' <span class="card-action" id="cardAction">' +
    actionDisplay + '</span> <span class="card-connector" id="cardConnector">' +
    opts.connector + '</span>';

  document.getElementById("cardReason").textContent = opts.reason;
  document.getElementById("cardStamp").innerHTML = opts.stamp;

  const cardEnd = document.querySelector(".card-end");
  if (cardEnd) cardEnd.style.display = "none";

  const cardEl = document.getElementById("resultCard");
  cardEl.classList.remove("card-danger", "card-crime");
  cardEl.classList.add(opts.cardClass);

  const blueSeal = document.querySelector(".card-stamp-seal-blue");
  if (blueSeal) blueSeal.innerHTML = opts.blueSeal;
  const seal = document.querySelector(".card-stamp-seal");
  if (seal) { seal.innerHTML = ""; seal.style.display = "none"; }

  document.querySelector(".card-header-left").textContent = opts.header;

  showSafetyLinks(opts.safetyCategory);

  const resultArea = document.getElementById("resultArea");
  resultArea.classList.remove("visible");
  void resultArea.offsetWidth;
  resultArea.classList.add("visible");

  restrictActionButtons();

  setTimeout(() => {
    resultArea.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 80);
}

function showDangerResponseA(action) {
  const t = I18N[currentLang];
  showDangerCard(action, {
    connector: t.dangerAConnector,
    reason: t.dangerAReason,
    stamp: t.dangerAStamp,
    header: t.dangerAHeader,
    cardClass: "card-danger",
    blueSeal: t.sealUrgent,
    safetyCategory: "A",
  });
}

function showDangerResponseA_Cant(action) {
  const t = I18N[currentLang];
  showDangerCard(action, {
    connector: t.dangerACantConnector,
    reason: t.dangerACantReason,
    stamp: t.dangerACantStamp,
    header: t.dangerACantHeader,
    cardClass: "card-danger",
    blueSeal: t.sealUrgent,
    safetyCategory: "A",
  });
}

function showDangerResponseB(action) {
  const t = I18N[currentLang];
  showDangerCard(action, {
    connector: t.dangerBConnector,
    reason: t.dangerBReason,
    stamp: t.dangerBStamp,
    header: t.dangerBHeader,
    cardClass: "card-crime",
    blueSeal: t.sealWarning,
    safetyCategory: "B",
  });
}

function showDangerResponseB_Cant(action) {
  const t = I18N[currentLang];
  showDangerCard(action, {
    connector: t.dangerBCantConnector,
    reason: t.dangerBCantReason,
    stamp: t.dangerBCantStamp,
    header: t.dangerBCantHeader,
    cardClass: "card-crime",
    blueSeal: t.sealWarning,
    safetyCategory: "B",
  });
}

function showSafetyLinks(category) {
  const existing = document.getElementById("safetyLinks");
  if (existing) existing.remove();

  const t = I18N[currentLang];
  const el = document.createElement("div");
  el.id = "safetyLinks";
  el.className = category === "A"
    ? "safety-links safety-links-a"
    : "safety-links safety-links-b";

  if (category === "A") {
    el.innerHTML =
      '<div class="safety-title">' + t.safetyTitleA + '</div>' +
      '<div class="safety-item">📞 자살예방상담전화 1393</div>' +
      '<div class="safety-item">📞 정신건강상담전화 1577-0199</div>' +
      '<div class="safety-item">📞 생명의전화 1588-9191</div>' +
      '<div class="safety-item">📞 청소년상담 1388</div>' +
      '<div class="safety-item">💬 마들랜·다들어줄개 (문자/SNS 상담)</div>';
  } else {
    el.innerHTML =
      '<div class="safety-title">' + t.safetyTitleB + '</div>' +
      '<div class="safety-item">📞 정신건강상담전화 1577-0199</div>' +
      '<div class="safety-item">📞 범죄피해자 지원센터 1301</div>' +
      '<div class="safety-item">📞 청소년상담 1388</div>';
  }

  const cardEl = document.getElementById("resultCard");
  cardEl.insertAdjacentElement("afterend", el);
}

function restrictActionButtons() {
  document.querySelectorAll(".btn-action").forEach(btn => {
    if (btn.getAttribute("onclick")?.includes("resetInput")) {
      btn.style.display = "";
      btn.style.flex = "1";
    } else {
      btn.style.display = "none";
    }
  });
  const hint = document.querySelector(".capture-hint");
  if (hint) hint.style.display = "none";
}

function restoreCard() {
  document.querySelectorAll(".btn-action").forEach(btn => {
    btn.style.display = "";
    btn.style.flex = "";
  });

  const cardEl = document.getElementById("resultCard");
  cardEl.classList.remove("card-danger", "card-crime");

  const cardEnd = document.querySelector(".card-end");
  if (cardEnd) cardEnd.style.display = "";

  const seal = document.querySelector(".card-stamp-seal");
  if (seal) { seal.style.display = ""; seal.innerHTML = I18N[currentLang].sealVerified; }

  document.querySelector(".card-header-left").textContent = I18N[currentLang].cardHeader;

  const hint = document.querySelector(".capture-hint");
  if (hint) hint.style.display = "";

  const existing = document.getElementById("safetyLinks");
  if (existing) existing.remove();
}

// ── 안전 필터 끝 ────────────────────────────────────────

function generate(type) {
  const action = input.value.trim();
  if (!action) return;

  restoreCard();
  const t = I18N[currentLang];
  const data = LANG_DATA[currentLang];

  // 안전 필터 (모든 언어 동일하게 적용 — 한국어 키워드 기준)
  if (!hasNegation(action)) {
    const dangerCategory = checkDangerCategory(action);
    if (dangerCategory === "A") {
      if (type === "cant") {
        showDangerResponseA_Cant(action);
      } else {
        showDangerResponseA(action);
      }
      return;
    }
    if (dangerCategory === "B") {
      if (type === "cant") {
        showDangerResponseB_Cant(action);
      } else {
        showDangerResponseB(action);
      }
      return;
    }
  }

  lastType = type;
  const isCant = type === "cant";

  // 언어별 데이터 선택
  const reasons = data
    ? (isCant ? data.CANT_DO : data.SHOULD_DO)
    : (isCant ? CANT_DO : SHOULD_DO);
  const authorityArr = data ? data.AUTHORITY : AUTHORITY;

  const reason = getRandom(reasons);
  const authority = getRandom(authorityArr);

  // 언어별 조사/파티클 처리
  const actionDisplay = addParticle(action, t.josaMode);

  // 카드 텍스트 세팅
  document.querySelector(".card-sentence").innerHTML =
    t.cardIntro + ' <span class="card-action" id="cardAction">' +
    actionDisplay + '</span> <span class="card-connector" id="cardConnector">' +
    (isCant ? t.cardConnectorCant : t.cardConnectorMust) + '</span>';

  document.getElementById("cardReason").textContent = reason;
  document.getElementById("cardStamp").textContent = authority;

  const cardEnd = document.querySelector(".card-end");
  if (cardEnd) {
    cardEnd.textContent = t.cardEnd;
    cardEnd.style.display = "";
  }

  const blueSeal = document.querySelector(".card-stamp-seal-blue");
  if (blueSeal) {
    blueSeal.innerHTML = isCant ? t.sealNope : t.sealYeap;
  }

  resultArea.classList.remove("visible");
  void resultArea.offsetWidth;
  resultArea.classList.add("visible");

  setTimeout(() => {
    resultArea.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 80);
}

function reroll() {
  if (lastType) generate(lastType);
}

function resetInput() {
  input.value = "";
  input.focus();
  charCount.textContent = "0";
  btnCant.disabled = true;
  btnMust.disabled = true;
  resultArea.classList.remove("visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveAsImage() {
  try {
    const blob = await cardToBlob();
    const link = document.createElement("a");
    link.download = `핑계자판기_${Date.now()}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(I18N[currentLang].toastSaved);
  } catch {
    showToast(I18N[currentLang].toastSaveFail);
  }
}

async function cardToBlob() {
  const canvas = await html2canvas(card, {
    backgroundColor: getComputedStyle(document.documentElement)
      .getPropertyValue("--card-bg")
      .trim() || "#10101c",
    scale: 2,
    useCORS: true,
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("toBlob failed")), "image/png");
  });
}

async function shareCard() {
  try {
    const blob = await cardToBlob();
    const file = new File([blob], "핑계자판기.png", { type: "image/png" });

    // 모바일: Web Share API (카톡, 디코 등 네이티브 공유)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "핑계 자판기",
        text: "공인된 핑계가 발급되었습니다.",
        files: [file],
      });
      return;
    }

    // 데스크톱: 클립보드에 이미지 복사
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    showToast(I18N[currentLang].toastCopied);
  } catch (e) {
    // 공유/복사 모두 실패 시 다운로드 폴백
    try {
      const blob = await cardToBlob();
      const link = document.createElement("a");
      link.download = `핑계자판기_${Date.now()}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      showToast(I18N[currentLang].toastSaved);
    } catch {
      showToast(I18N[currentLang].toastShareFail);
    }
  }
}

// Enter 키 → 못 하는 이유 뽑기
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    generate("cant");
  }
});

function copyMail() {
  navigator.clipboard.writeText("leechanhyeok25@gmail.com").then(() => {
    showToast(I18N[currentLang].toastMail);
  }).catch(() => {
    showToast(I18N[currentLang].toastMailFail);
  });
}

// 페이지 로드 시 저장된 언어 적용
if (savedLang && savedLang !== "ko") {
  setLang(savedLang);
}
