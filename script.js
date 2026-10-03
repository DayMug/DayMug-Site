// Reveal-on-scroll
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) {
      e.classList.add("in");
    });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );
  els.forEach(function (e) {
    io.observe(e);
  });
})();

// Copy buttons
document.querySelectorAll(".codeblock__copy").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var text = btn.getAttribute("data-copy") || "";
    if (!text) return;
    var ok = function () {
      var prev = btn.textContent;
      btn.textContent = "copied ✓";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = prev;
        btn.classList.remove("copied");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(ok)
        .catch(function () {});
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        ok();
      } catch (e) {}
      document.body.removeChild(ta);
    }
  });
});

// OS picker. Commands differ between Linux and macOS, so each command block
// has a variant per OS. The visitor's own system is shown by default — macOS
// on a Mac, Linux for everyone else, Windows included, since DayMug has no
// Windows build. An explicit pick is shared by every page (localStorage) and
// every open tab (storage event). The <head> snippet on each page applies the
// same choice before first paint.
(function () {
  var KEY = "daymug-os";
  var LABELS = { linux: "Linux", macos: "macOS" };
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return LABELS[v] ? v : "";
    } catch (e) {
      return "";
    }
  }

  function detect() {
    var p = (navigator.userAgentData && navigator.userAgentData.platform) ||
      navigator.platform || navigator.userAgent || "";
    if (/mac/i.test(p)) return "macos";
    if (/win/i.test(p)) return "windows";
    if (/linux|x11/i.test(p) && !/android/i.test(p)) return "linux";
    return "";
  }

  var detected = detect();
  var fallback = detected === "macos" ? "macos" : "linux";

  function apply(os) {
    root.setAttribute("data-os", os);
    document.querySelectorAll("[data-os-pick]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-os-pick") === os ? "true" : "false");
    });
  }

  function pick(os) {
    try {
      localStorage.setItem(KEY, os);
    } catch (e) {}
    apply(os);
  }

  document.querySelectorAll(".os-switch").forEach(function (el) {
    el.innerHTML =
      '<span class="os-switch__label">Your OS</span><span class="os-switch__btns" role="group" aria-label="Operating system">' +
      Object.keys(LABELS)
        .map(function (os) {
          return '<button type="button" class="os-switch__btn" data-os-pick="' + os + '" aria-pressed="false">' +
            LABELS[os] + (os === detected ? ' <span class="os-switch__hint">detected</span>' : "") + "</button>";
        })
        .join("") +
      "</span>" +
      (detected === "windows"
        ? '<span class="os-switch__note">On Windows? There is no Windows build, so these are the Linux commands: run DayMug on a Linux or Mac machine — teammates on Windows only need a browser.</span>'
        : "");
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-os-pick]");
    if (b) pick(b.getAttribute("data-os-pick"));
  });
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) apply(stored() || fallback);
  });

  apply(stored() || fallback);
})();

// Mobile nav: a toggle that opens every nav link in a drop-down sheet.
(function () {
  var nav = document.querySelector(".nav");
  var inner = nav && nav.querySelector(".nav__inner");
  var links = nav && nav.querySelector(".nav__links");
  if (!inner || !links) return;
  links.id = links.id || "nav-links";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav__toggle";
  btn.setAttribute("aria-controls", links.id);
  btn.innerHTML =
    '<svg class="nav__toggle-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
    '<svg class="nav__toggle-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  inner.appendChild(btn);

  function set(open) {
    nav.classList.toggle("nav--open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  set(false);

  btn.addEventListener("click", function () {
    set(!nav.classList.contains("nav--open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) set(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("nav--open")) {
      set(false);
      btn.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) set(false);
  });
  window.matchMedia("(min-width: 981px)").addEventListener("change", function (e) {
    if (e.matches) set(false);
  });
})();
