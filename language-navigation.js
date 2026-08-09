(function () {
  "use strict";

  var japaneseSection = document.querySelector('section[lang="ja"]');
  var englishSection = document.querySelector('section[lang="en"]');

  if (japaneseSection) japaneseSection.id = "ja";
  if (englishSection) englishSection.id = "en";

  var explicitLanguage = /^#(ja|en)$/.exec(window.location.hash);
  var browserLanguage = /^ja(?:-|$)/i.test(window.navigator.language || "")
    ? "ja"
    : "en";
  var language = explicitLanguage ? explicitLanguage[1] : browserLanguage;

  document.documentElement.lang = language;

  var style = document.createElement("style");
  style.textContent =
    ".language-site-nav{margin:28px 0 0;padding:16px 18px;background:rgba(255,255,255,.06);border-left:5px solid #00ffaa;border-radius:6px}" +
    ".language-site-nav strong{color:#72ffd0}" +
    ".language-site-nav a{color:#6bd9ff}" +
    ".external-site-note{margin-left:.35em;color:#ffdd55;font-size:.9em}";
  document.head.appendChild(style);

  document.querySelectorAll("a[href]").forEach(function (link) {
    var href = link.getAttribute("href");
    var internalPage = /^(?:https:\/\/kawaiikagari\.github\.io\/KagaLinguaRelay-Manuals\/)?(?:index|visitor-guide|support-status|owner-manual|error-codes)\.html(?:#(?:ja|en))?$/;

    if (!href) return;

    if (internalPage.test(href)) {
      link.setAttribute("href", href.replace(/#(?:ja|en)$/, "") + "#" + browserLanguage);
      return;
    }

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.hostname !== "developers.deepl.com" && url.hostname !== "learn.microsoft.com") return;

    var linkSection = link.closest("section[lang]");
    var note = document.createElement("span");
    note.className = "external-site-note";
    note.textContent = linkSection && linkSection.lang === "ja"
      ? "（外部Webに飛びます：翻訳サービス）"
      : "(Opens an external website: translation service)";
    link.insertAdjacentElement("afterend", note);
  });

  var pages = [
    { file: "index.html", ja: "導入編", en: "Getting Started" },
    { file: "visitor-guide.html", ja: "ご利用ガイド", en: "Visitor Guide" },
    { file: "owner-manual.html", ja: "オーナーマニュアル", en: "Owner Manual" },
    { file: "support-status.html", ja: "対応言語", en: "Support Status" },
    { file: "error-codes.html", ja: "エラーコードと通知", en: "Error Codes and Notices" }
  ];

  [japaneseSection, englishSection].forEach(function (section) {
    if (!section) return;

    var sectionLanguage = section.lang === "ja" ? "ja" : "en";
    var navigation = document.createElement("nav");
    navigation.className = "language-site-nav";
    navigation.setAttribute("aria-label", sectionLanguage === "ja" ? "説明書ページ一覧" : "Manual pages");

    var heading = document.createElement("strong");
    heading.textContent = sectionLanguage === "ja" ? "説明書ページ一覧" : "All Manual Pages";
    navigation.appendChild(heading);
    navigation.appendChild(document.createElement("br"));

    pages.forEach(function (page, index) {
      if (index > 0) navigation.appendChild(document.createTextNode(" ／ "));

      var link = document.createElement("a");
      link.href = "https://kawaiikagari.github.io/KagaLinguaRelay-Manuals/" + page.file + "#" + browserLanguage;
      link.textContent = page[sectionLanguage];
      navigation.appendChild(link);
    });

    section.appendChild(navigation);
  });

  if (window.location.hash && !explicitLanguage) return;

  var target = document.getElementById(language);
  if (!target) return;

  if (!explicitLanguage) {
    window.history.replaceState(null, "", "#" + language);
  }

  window.requestAnimationFrame(function () {
    target.scrollIntoView();
  });
})();
