(function () {
  "use strict";

  var links = document.querySelectorAll(".manual-figure a");
  if (!links.length || typeof HTMLDialogElement === "undefined" ||
      typeof HTMLDialogElement.prototype.showModal !== "function") return;

  var dialog = document.createElement("dialog");
  dialog.className = "manual-image-dialog";
  dialog.setAttribute("aria-labelledby", "manual-image-dialog-title");
  dialog.setAttribute("aria-describedby", "manual-image-dialog-caption");

  var header = document.createElement("div");
  header.className = "manual-image-dialog-header";
  var title = document.createElement("h2");
  title.id = "manual-image-dialog-title";
  var closeButton = document.createElement("button");
  closeButton.type = "button";
  header.appendChild(title);
  header.appendChild(closeButton);

  var view = document.createElement("div");
  view.className = "manual-image-dialog-view";
  var image = document.createElement("img");
  view.appendChild(image);
  var caption = document.createElement("p");
  caption.className = "manual-image-dialog-caption";
  caption.id = "manual-image-dialog-caption";

  dialog.appendChild(header);
  dialog.appendChild(view);
  dialog.appendChild(caption);
  document.body.appendChild(dialog);

  var opener;
  links.forEach(function (link) {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", function (event) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      var thumbnail = link.querySelector("img");
      if (!thumbnail) return;

      event.preventDefault();
      opener = link;
      var section = link.closest("section[lang]");
      var japanese = section && section.lang === "ja";
      dialog.lang = japanese ? "ja" : "en";
      title.textContent = japanese ? "画像（原寸100％）" : "Image (100% size)";
      closeButton.textContent = japanese ? "閉じる" : "Close";
      image.src = link.href;
      image.alt = thumbnail.alt;
      image.width = Number(thumbnail.getAttribute("width"));
      image.height = Number(thumbnail.getAttribute("height"));
      var figureCaption = link.closest("figure").querySelector("figcaption");
      caption.textContent = figureCaption ? figureCaption.textContent
        .replace(/画像をクリックすると拡大表示できます。|Click the image to enlarge\./g, "").trim() : "";
      dialog.showModal();
      view.scrollTop = 0;
      view.scrollLeft = 0;
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (event) {
    var bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener("close", function () {
    image.removeAttribute("src");
    if (opener) opener.focus({ preventScroll: true });
  });
})();
