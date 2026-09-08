/* DEK Advisory Group — site scripts. No dependencies. */
(function () {
  'use strict';

  /* ---- Mobile navigation ---------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });

    // Close when a link is tapped
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        toggle.focus();
      }
    });

    // Reset when resizing back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 940) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      }
    });
  }

  /* ---- Reveal on scroll ------------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Current year in the footer -------------------------------------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }

  /* ---- Enquiry form ----------------------------------------------------
     The form posts to whatever action the host provides (FormSubmit,
     Formspree, or a mail script on the server). Until an endpoint is wired
     up, it falls back to opening the visitor's mail client so no enquiry is
     silently lost. See README for how to connect a real endpoint.
  ---------------------------------------------------------------------- */
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Honeypot: silently drop bot submissions
      var trap = form.querySelector('input[name="_company"]');
      if (trap && trap.value) { e.preventDefault(); return; }

      var action = form.getAttribute('action') || '';
      if (action.indexOf('REPLACE_WITH_ENDPOINT') === -1 && action !== '') { return; }

      // No endpoint configured yet — hand off to the visitor's mail client.
      e.preventDefault();
      var get = function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        return el ? el.value.trim() : '';
      };
      var body = [
        'Name: ' + get('name'),
        'Email: ' + get('email'),
        'Phone: ' + get('phone'),
        'Enquiry about: ' + get('topic'),
        '',
        get('message')
      ].join('\n');

      window.location.href = 'mailto:dion@dekgroup.com.au'
        + '?subject=' + encodeURIComponent('Website enquiry from ' + (get('name') || 'a visitor'))
        + '&body=' + encodeURIComponent(body);
    });
  }
})();
