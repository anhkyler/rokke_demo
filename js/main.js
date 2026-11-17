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
              "If nothing opened, email " + to + " or call (803) 555-0142.", "success");
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

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
