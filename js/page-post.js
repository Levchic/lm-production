/**
 * Страница отдельной новости: post.html?id=<id записи из админки>.
 * Всё содержимое берётся из js/content.js — blog.posts.
 */
(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  function getPost(d) {
    var id = new URLSearchParams(location.search).get("id");
    var posts = d.blog.posts || [];
    return posts.filter(function (p) { return p.id === id; })[0] || posts[0] || null;
  }

  function toggle(node, visible) {
    if (node) node.style.display = visible ? "" : "none";
  }

  function render() {
    var d = t();
    var post = getPost(d);

    if (!post) {
      $("#postTitle").textContent = d.blog.postNotFound || "Новость не найдена.";
      ["#postBodySection", "#postPhotosSection", "#postLinksSection"].forEach(function (s) { toggle($(s), false); });
      $("#backLink").innerHTML = C.withArrow(d.blog.backLabel || d.blog.viewAll || "", "left");
      return;
    }

    document.title = post.title + " — " + d.hero.name;
    var metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", post.excerpt || d.meta.description);

    var cover = $("#postCoverBg");
    var ink = $("#inkStain");
    if (post.cover) {
      cover.style.backgroundImage = "url(" + post.cover + ")";
      cover.classList.add("visible");
      ink.style.display = "none";
    } else {
      cover.classList.remove("visible");
      cover.style.backgroundImage = "";
      ink.style.display = "";
    }

    var category = $("#postCategory");
    category.textContent = post.category || "";
    toggle(category, !!post.category);

    $("#postTitle").textContent = post.title || "";
    $("#postDate").textContent = post.date && post.date !== "—" ? post.date : "";
    $("#postExcerpt").textContent = post.excerpt || "";

    var flag = $("#placeholderFlag");
    if (post.isPlaceholder) { flag.textContent = d.common.placeholderFlag; flag.style.display = "inline-block"; }
    else { flag.style.display = "none"; }

    // Пустая строка в тексте = новый абзац. Так текст можно писать
    // прямо в админке, без разметки.
    var body = $("#postBody");
    body.innerHTML = "";
    var paragraphs = String(post.body || "").split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    paragraphs.forEach(function (text) { body.appendChild(el("p", null, esc(text).replace(/\n/g, "<br>"))); });
    toggle($("#postBodySection"), paragraphs.length > 0);

    // Ссылка на YouTube / VK / Rutube превращается во встроенный плеер
    var videoBox = $("#postVideo");
    if (post.video) {
      videoBox.innerHTML = C.videoEmbed(post.video, post.title);
      toggle($("#postVideoSection"), true);
    } else {
      videoBox.innerHTML = "";
      toggle($("#postVideoSection"), false);
    }

    var photos = (post.photos || []).filter(Boolean);
    var photoGrid = $("#postPhotos");
    photoGrid.innerHTML = photos.map(function (src, i) {
      return C.photoTile(src, post.title, "post", i);
    }).join("");
    $("#postPhotosHeading").textContent = d.blog.photosHeading || "";
    toggle($("#postPhotosSection"), photos.length > 0);

    var links = (post.links || []).filter(function (l) { return l && l.href; });
    var linkList = $("#postLinks");
    linkList.innerHTML = "";
    links.forEach(function (link) {
      var li = el("li");
      var a = el("a", "text-link", esc(link.label || link.href));
      a.href = link.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);
      linkList.appendChild(li);
    });
    $("#postLinksHeading").textContent = d.blog.linksHeading || "";
    toggle($("#postLinksSection"), links.length > 0);

    $("#backLink").innerHTML = C.withArrow(d.blog.backLabel || d.blog.viewAll || "", "left");
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
