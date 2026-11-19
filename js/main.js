(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  /* Header shadow on scroll */
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* Reveal on scroll + active nav link */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Contact form (contact page only) */
  var form = document.querySelector(".contact-form");
  if (form) initForm(form);

  function initForm(form) {
  /* contact.html?service=full pre-checks full-service management */
  if (/[?&]service=full/.test(location.search)) {
    var box = form.querySelector('input[name="services"][value="Full-service property management"]');
    if (box) box.checked = true;
  }

  var status = form.querySelector(".form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    form.querySelectorAll("[required]").forEach(function (f) {
      var ok = f.checkValidity();
      f.closest(".field").classList.toggle("has-error", !ok);
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstBad) firstBad = f;
    });
    if (firstBad) {
      setStatus("Please complete the highlighted fields.", "error");
      firstBad.focus();
      return;
    }

    /* No backend yet: build an email and open it in the visitor's mail app */
    var data = new FormData(form);
    var val = function (k) { return (data.get(k) || "").toString().trim(); };
    var services = data.getAll("services").join(", ") || "Not specified";
    var lines = [
      "Consultation request from rokkemanagement.com",
      "",
      "Name: " + val("name"),
      "Phone: " + val("phone"),
      "Email: " + val("email"),
      "Property location: " + val("property_location"),
      "Property type: " + val("property_type"),
      "Number of units / properties: " + val("units"),
      "Services requested: " + services,
      "",
      "Additional comments:",
      val("comments") || "None"
    ];
    var to = form.dataset.mailto;
    var subject = "Consultation Request: " + val("name") + " (" + val("property_location") + ")";
    var href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) +
               "&body=" + encodeURIComponent(lines.join("\r\n"));

    if (window.gtag) window.gtag("event", "generate_lead", { form: "consultation", method: "mailto" });
    window.location.href = href;
    setStatus("Your email app should now open with your request filled in. Please press Send to finish. " +
              "If nothing opened, email " + to + " or call (843) 624-3433.", "success");
  });

  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (field && field.classList.contains("has-error") && e.target.checkValidity()) {
      field.classList.remove("has-error");
      e.target.setAttribute("aria-invalid", "false");
    }
  });
  }

  /* Track phone/email clicks in Analytics */
  document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.gtag) window.gtag("event", "contact_click", { method: a.protocol.replace(":", "") });
    });
  });

  /* Service Areas: click a community to see its photos */
  var areaData = document.getElementById("area-photos");
  if (areaData) initAreas(JSON.parse(areaData.textContent));

  function initAreas(areas) {
    var main = document.getElementById("area-main");
    var nameEl = document.getElementById("area-name");
    var capEl = document.getElementById("area-caption");
    var creditEl = document.getElementById("area-credit");
    var thumbsEl = document.getElementById("area-thumbs");
    var chips = document.querySelectorAll(".area-chip");
    var current = areas[0];

    function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }

    function showPhoto(i) {
      var p = current.photos[i];
      main.classList.add("is-fading");
      var img = new Image();
      img.onload = img.onerror = function () {
        main.src = p.src;
        main.alt = p.caption;
        main.classList.remove("is-fading");
      };
      img.src = p.src;
      capEl.textContent = p.caption;
      creditEl.innerHTML = p.credit
        ? 'Photo: <a href="' + esc(p.source) + '" target="_blank" rel="noopener">' + esc(p.credit) + "</a>, " + esc(p.license)
        : "";
      thumbsEl.querySelectorAll(".area-thumb").forEach(function (b, n) {
        b.classList.toggle("is-active", n === i);
        b.setAttribute("aria-pressed", String(n === i));
      });
    }

    function showArea(name) {
      var a = areas.filter(function (x) { return x.name === name; })[0];
      if (!a) return;
      current = a;
      nameEl.textContent = a.name + ", SC";
      thumbsEl.innerHTML = a.photos.length > 1 ? a.photos.map(function (p, n) {
        return '<button type="button" class="area-thumb" data-index="' + n + '" aria-label="Show photo ' + (n + 1) + ": " + esc(p.caption) +
               '" aria-pressed="false"><img src="' + esc(p.src) + '" alt="" width="160" height="110"></button>';
      }).join("") : "";
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.area === name)); });
      showPhoto(0);
    }

    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        showArea(c.dataset.area);
        /* On small screens the photo sits above the list: bring it into view */
        var r = main.getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) {
          main.closest(".area-gallery").scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
    thumbsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".area-thumb");
      if (b) showPhoto(Number(b.dataset.index));
    });

    /* Preload the other photos after the page settles */
    window.addEventListener("load", function () {
      areas.forEach(function (a) { a.photos.forEach(function (p) { new Image().src = p.src; }); });
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
