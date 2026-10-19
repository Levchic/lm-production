(function () {
  "use strict";
  var C = window.SiteCommon;
  var $ = C.$, el = C.el, t = C.t, esc = C.esc;

  /* Черновик по прямой ссылке открывается — так его можно посмотреть
     перед публикацией. Ссылок на него на сайте нет, а «проект по
     умолчанию» берётся уже из опубликованных. */
  function getProject(d) {
    var id = new URLSearchParams(location.search).get("id");
    return d.portfolio.projects.find(function (p) { return p.id === id; }) ||
           C.visibleProjects(d)[0] || d.portfolio.projects[0];
  }

  function toggle(node, visible) {
    if (node) node.style.display = visible ? "" : "none";
  }

  function render() {
    var d = t();
    var proj = getProject(d);

    document.title = proj.title + " — " + d.hero.name;

    var heroBg = $("#caseHeroBg");
    var inkStain = $("#inkStain");
    if (proj.heroImage) {
      heroBg.style.backgroundImage = "url(" + proj.heroImage + ")";
      heroBg.classList.add("visible");
      inkStain.style.display = "none";
    } else {
      heroBg.classList.remove("visible");
      heroBg.style.backgroundImage = "";
      inkStain.style.display = "";
    }

    $("#categoryTag").textContent = proj.categoryLabel;
    $("#title").textContent = proj.title;
    $("#meta").textContent = proj.meta;
    $("#description").textContent = proj.description;

    var flag = $("#placeholderFlag");
    if (proj.isPlaceholder) { flag.textContent = d.common.placeholderFlag; flag.style.display = "inline-block"; }
    else { flag.style.display = "none"; }

    /* Цифры */
    var stats = $("#stats"); stats.innerHTML = "";
    if (proj.stats && proj.stats.length) {
      stats.style.display = "flex";
      proj.stats.forEach(function (s) {
        stats.appendChild(el("div", "stat-card",
          '<span class="icon">' + C.statIconSVG(s.icon) + "</span>" +
          '<div><div class="n">' + esc(s.value) + '</div><div class="l">' + esc(s.label) + "</div></div>"
        ));
      });
    } else {
      stats.style.display = "none";
    }

    /* Этапы работы */
    var scopeSection = $("#scopeSection");
    if (proj.scope && proj.scope.length) {
      toggle(scopeSection, true);
      $("#scopeHeading").textContent = d.portfolio.stagesLabel;
      var list = $("#scopeList"); list.innerHTML = "";
      proj.scope.forEach(function (step) { list.appendChild(el("li", null, esc(step))); });
    } else {
      toggle(scopeSection, false);
    }

    /* Фото — отдельным блоком */
    var photos = proj.photos || [];
    var photoGrid = $("#photoGrid");
    toggle($("#photoSection"), photos.length > 0);
    photoGrid.innerHTML = "";
    if (photos.length) {
      $("#photoHeading").textContent = d.portfolio.galleryLabel;
      photos.forEach(function (src, i) {
        photoGrid.insertAdjacentHTML("beforeend", C.photoTile(src, proj.title, "case-photos", i));
      });
    }

    /* Видео — отдельным блоком. Ссылка на Spotify / Яндекс Музыку — это
       запись, а не ролик: даже вписанная в «Видео», она уходит в «Аудио». */
    var allVideos = proj.videos || [];
    var videos = allVideos.filter(function (v) { return !C.isMusicURL(v.url); });
    var music = (proj.music || []).concat(allVideos.filter(function (v) { return C.isMusicURL(v.url); }))
      .filter(function (m) { return m.url; });
    var videoGrid = $("#videoGrid");
    toggle($("#videoSection"), videos.length > 0);
    videoGrid.innerHTML = "";
    if (videos.length) {
      $("#videoHeading").textContent = d.portfolio.videoLabel;
      videos.forEach(function (v) {
        // ссылка на YouTube/VK/Rutube — плеер сервиса, иначе свой файл
        videoGrid.insertAdjacentHTML("beforeend",
          v.url ? C.videoEmbed(v.url, v.title) : C.videoTile(v.src, v.poster));
      });
    }

    /* Аудио — отдельным блоком: сначала плееры площадок, под ними свои файлы */
    var tracks = proj.audio || [];
    var audioList = $("#audioList");
    var musicList = $("#musicList");
    toggle($("#audioSection"), tracks.length > 0 || music.length > 0);
    audioList.innerHTML = "";
    musicList.innerHTML = music.map(function (m) { return C.musicEmbed(m.url, m.title); }).join("");
    if (tracks.length || music.length) {
      $("#audioHeading").textContent = d.portfolio.audioLabel;
      tracks.forEach(function (track) {
        audioList.insertAdjacentHTML("beforeend", C.audioItem(track));
      });
    }

    $("#backLink").innerHTML = C.withArrow(d.portfolio.backToList, "left");
  }

  document.addEventListener("DOMContentLoaded", function () { C.init(render); });
})();
