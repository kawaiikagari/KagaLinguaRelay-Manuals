(function () {
  "use strict";

  var japaneseSection = document.querySelector('section[lang="ja"]');
  var englishSection = document.querySelector('section[lang="en"]');

  if (japaneseSection) japaneseSection.id = "ja";
  if (englishSection) englishSection.id = "en";

  var explicitLanguage = /^#(ja|en)$/.exec(window.location.hash);
  var language = explicitLanguage
    ? explicitLanguage[1]
    : /^ja(?:-|$)/i.test(window.navigator.language || "")
      ? "ja"
      : "en";

  document.documentElement.lang = language;

  document.querySelectorAll("a[href]").forEach(function (link) {
    var href = link.getAttribute("href");
    var internalPage = /^(?:https:\/\/kawaiikagari\.github\.io\/KagaLinguaRelay-Manuals\/)?(?:index|visitor-guide|support-status|owner-manual|error-codes)\.html(?:#(?:ja|en))?$/;

    if (!href || !internalPage.test(href)) return;

    var section = link.closest("section[lang]");
    var linkLanguage = section ? section.lang : language;
    link.setAttribute("href", href.replace(/#(?:ja|en)$/, "") + "#" + linkLanguage);
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
