(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  var TARGET = new Date(2026, 5, 22, 0, 0, 0); // 22 June 2026, midnight local
  var FORCE = window.FORCE_BIRTHDAY === true || /[?&]preview/i.test(location.search);

  /* =====================================================================
     SONG SUBTITLES  —  PASTE YOUR OWN LINES HERE.
     Each entry: { t: <seconds into love.mp3>, line: "<text>" }
     A line shows at time t and stays until the next one. They loop
     automatically when love.mp3 loops. Replace the placeholders below
     with your prepared array (same shape) and the timings apply as-is.
  ===================================================================== */
   var LYRICS = [
        { t: -0.9, line: "\u266A You make me feel like I am fun again" },
    { t: 6.1, line: "However far away" },
    { t: 12.1, line: "\u266A I will always love you" },
    { t: 16.1, line: "However long I stay" },    
    { t: 21.1, line: "\u266A I will always love you" }, 
    { t: 25.1, line: "Whatever words I say" },    
    { t: 29.1, line: "\u266A I will always love you" }, 
    { t: 32.1, line: "\u266A I will always love you" }  
  ];
  var content = {
    en: {
      greeting: "Happy Birthday",
      end: "From G \uD83D\uDC30",
      html:
        "<p>I'm sorry. For everything I didn't do for you, and for not giving you the attention you deserved.</p>" +
        "<p>I was trying my best \u2014 but clearly I was bad at it, and I'm sorry for all of it.</p>" +
        "<p>I truly wish you the best in life. You may see me again, or you may not. Either way, I only hope you find everything you're looking for, and that life gives you what you want.</p>"
    },
    ku: {
      greeting: "\u0695\u06C6\u0698\u06CC \u0644\u06D5\u062F\u0627\u06CC\u06A9\u0628\u0648\u0648\u0646\u062A \u067E\u06CC\u0631\u06C6\u0632 \u0628\u06CE\u062A",
      end: "G \uD83D\uDC30",
      html:
        "<p>\u0628\u0628\u0648\u0631\u06D5. \u0628\u06C6 \u0647\u06D5\u0645\u0648\u0648 \u0626\u06D5\u0648 \u0634\u062A\u0627\u0646\u06D5\u06CC \u06A9\u06D5 \u0628\u06C6\u0645 \u0646\u06D5\u06A9\u0631\u062F\u06CC\u062A\u060C \u0648 \u0628\u06C6 \u0626\u06D5\u0648\u06D5\u06CC \u0626\u06D5\u0648 \u0633\u06D5\u0631\u0646\u062C\u06D5\u0645 \u067E\u06CE\u0646\u06D5\u062F\u0627\u06CC\u062A \u06A9\u06D5 \u0634\u0627\u06CC\u0633\u062A\u06D5\u06CC \u0628\u0648\u0648\u06CC\u062A.</p>" +
        "<p>\u0647\u06D5\u0648\u06B5\u06CC \u0628\u0627\u0634\u062A\u0631\u06CC\u0646\u0645 \u062F\u06D5\u062F\u0627 \u2014 \u0628\u06D5\u06B5\u0627\u0645 \u062F\u06CC\u0627\u0631\u06D5 \u0628\u0627\u0634 \u0646\u06D5\u0628\u0648\u0648\u0645 \u062A\u06CE\u06CC\u062F\u0627\u060C \u0648 \u062F\u0627\u0648\u0627\u06CC \u0644\u06CE\u0628\u0648\u0631\u062F\u0646 \u062F\u06D5\u06A9\u06D5\u0645 \u0628\u06C6 \u0647\u06D5\u0645\u0648\u0648\u06CC.</p>" +
        "<p>\u0628\u06D5\u0695\u0627\u0633\u062A\u06CC \u0628\u0627\u0634\u062A\u0631\u06CC\u0646\u062A \u0628\u06C6 \u062F\u06D5\u062E\u0648\u0627\u0632\u0645 \u0644\u06D5 \u0698\u06CC\u0627\u0646\u062F\u0627. \u0644\u06D5\u0648\u0627\u0646\u06D5\u06CC\u06D5 \u062C\u0627\u0631\u06CE\u06A9\u06CC \u062A\u0631 \u0628\u0645\u0628\u06CC\u0646\u06CC\u062A\u060C \u06CC\u0627\u0646 \u0646\u0627. \u0647\u06D5\u0631\u0686\u06C6\u0646\u06CE\u06A9 \u0628\u06CE\u062A\u060C \u062A\u06D5\u0646\u0647\u0627 \u0647\u06CC\u0648\u0627\u062F\u0627\u0631\u0645 \u0647\u06D5\u0645\u0648\u0648 \u0626\u06D5\u0648 \u0634\u062A\u06D5 \u0628\u062F\u06C6\u0632\u06CC\u062A\u06D5\u0648\u06D5 \u06A9\u06D5 \u0628\u06D5\u062F\u0648\u0627\u06CC\u062F\u0627 \u062F\u06D5\u06AF\u06D5\u0695\u06CE\u06CC\u062A\u060C \u0648 \u0698\u06CC\u0627\u0646 \u0626\u06D5\u0648\u06D5\u062A \u0628\u062F\u0627\u062A\u06CE \u06A9\u06D5 \u062F\u06D5\u062A\u06D5\u0648\u06CE\u062A.</p>"
    }
  };

  /* ---------- background video ---------- */
  var bg = $("bg");
  function tryVideo() { var p = bg.play(); if (p && p.catch) p.catch(function () {}); }
  tryVideo();

  /* ---------- music (local love.mp3, loops) ---------- */
  var song = $("song"), playing = false;
  function playSong() { var p = song.play(); if (p && p.then) p.then(function () { playing = true; updateBtn(); }).catch(function () {}); }
  function pauseSong() { song.pause(); playing = false; updateBtn(); }
  function updateBtn() { var b = $("soundToggle"); b.classList.toggle("muted", !playing); b.textContent = playing ? "\u266A" : "\u266B"; }
  song.addEventListener("playing", function () { playing = true; updateBtn(); });
  song.addEventListener("pause", function () { playing = false; updateBtn(); });
  $("soundToggle").addEventListener("click", function () { if (playing) pauseSong(); else playSong(); });

  /* ---------- timed caption (big translucent subtitle, fades) ---------- */
  var capEl = $("caption"), lastLine = null;
  capEl.setAttribute("dir", "ltr");
  function updateCaption() {
    var t = song.currentTime, line = null;
    for (var i = 0; i < LYRICS.length; i++) { if (t >= LYRICS[i].t) line = LYRICS[i].line; else break; }
    if (line !== lastLine) {
      lastLine = line;
      capEl.classList.remove("show");
      setTimeout(function () {
        capEl.textContent = line || "";
        if (line) capEl.classList.add("show");
      }, 320);
    }
  }
  song.addEventListener("timeupdate", updateCaption);

  /* ---------- language ---------- */
  function setLang(lang) {
    var body = $("body"), greeting = $("greeting"), end = $("end");
    $("btnEn").classList.toggle("active", lang === "en");
    $("btnKu").classList.toggle("active", lang === "ku");
    body.classList.add("fade");
    setTimeout(function () {
      var c = content[lang], dir = lang === "ku" ? "rtl" : "ltr";
      body.innerHTML = c.html; body.setAttribute("dir", dir);
      greeting.textContent = c.greeting; greeting.setAttribute("dir", dir);
      end.textContent = c.end;
      body.classList.remove("fade");
    }, 360);
  }
  $("btnEn").addEventListener("click", function () { setLang("en"); });
  $("btnKu").addEventListener("click", function () { setLang("ku"); });

  /* ---------- screens ---------- */
  function show(id) {
    var s = document.querySelectorAll(".screen");
    for (var i = 0; i < s.length; i++) s[i].classList.remove("on");
    $(id).classList.add("on");
  }
  function openMessage() { show("message"); $("soundToggle").classList.add("show"); setLang("en"); }
  function startGate() {
    show("gate");
    $("openBtn").addEventListener("click", function () {
      this.classList.add("go");
      tryVideo();
      playSong(); // user tap -> sound allowed
      setTimeout(openMessage, 760);
    }, { once: true });
  }

  /* ---------- countdown ---------- */
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = TARGET - new Date();
    if (diff <= 0) { if ($("locked").classList.contains("on")) startGate(); return; }
    $("d").textContent = Math.floor(diff / 86400000);
    $("h").textContent = pad(Math.floor((diff % 86400000) / 3600000));
    $("m").textContent = pad(Math.floor((diff % 3600000) / 60000));
    $("s").textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  /* ---------- init ---------- */
  if (FORCE || new Date() >= TARGET) {
    startGate();
  } else {
    show("locked");
    tick();
    setInterval(tick, 1000);
  }
})();
