// Sticky glass nav on scroll + parallax hero + page loader hide
(function(){
  var header = document.querySelector('.header.glass-nav');
  var loader = document.getElementById('page-loader');
  var layers = document.querySelectorAll('.parallax-layer');
  var navContent = document.querySelector('.nav-content');
  var navToggle = document.querySelector('.nav-toggle');

  window.addEventListener('load', function(){ if (loader) loader.classList.add('is-hidden'); });

  window.addEventListener('scroll', function(){
    var sc = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', sc > 10);
    var factor = Math.min(sc / 600, 1);
    layers.forEach(function(el, idx){ var depth = (idx + 1) * 6; el.style.transform = 'translateY(' + (factor * depth) + 'px)'; });
  }, { passive: true });

  if (navToggle && navContent) {
    navToggle.addEventListener('click', function(){
      var open = navContent.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();

// Reusable Zoho popup – one script for the whole site
(function () {
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.zoho-popup');
    if (!trigger) return;
    e.preventDefault();
    var formUrl = trigger.getAttribute('data-form');
    if (!formUrl) { console.warn('zoho-popup: missing data-form'); return; }
    openZohoPopup(formUrl);
  });

  function openZohoPopup(formUrl) {
    var uid = makeIdFromUrl(formUrl);
    var lightbox = document.getElementById('zf-lightbox-' + uid);
    if (!lightbox) {
      lightbox = buildLightbox(uid, formUrlWithParam(formUrl, 'zf_rszfm=1'));
      document.body.appendChild(lightbox);
    }
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    var closeBtn = lightbox.querySelector('.zf-close');
    if (closeBtn) closeBtn.focus();
  }

  function buildLightbox(uid, src) {
    var lightbox = document.createElement('div');
    lightbox.id = 'zf-lightbox-' + uid;
    lightbox.style.display = 'none';

    var dimmer = document.createElement('div');
    dimmer.className = 'zf-dimmer';
    dimmer.addEventListener('click', function(){ closePopup(uid); });

    var wrapper = document.createElement('div');
    wrapper.className = 'zf-wrapper';

    var container = document.createElement('div');
    container.className = 'zf-container';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'zf-close';
    closeBtn.setAttribute('aria-label', 'Close form');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function(){ closePopup(uid); });

    document.addEventListener('keydown', function escHandler(ev){
      if ((document.getElementById('zf-lightbox-' + uid) || {}).style?.display === 'block' && (ev.key === 'Escape' || ev.keyCode === 27)) {
        closePopup(uid);
      }
    });

    var iframe = document.createElement('iframe');
    iframe.className = 'zf-iframe';
    iframe.src = src;
    iframe.allow = 'clipboard-write *; clipboard-read *';

    container.appendChild(iframe);
    container.appendChild(closeBtn);
    wrapper.appendChild(container);
    lightbox.appendChild(wrapper);
    lightbox.appendChild(dimmer);

    window.addEventListener('message', function (event) {
      if (!event || typeof event.data !== 'string') return;
      var parts = event.data.split('|');
      if (parts.length < 2) return;
      var perma = parts[0];
      var newH = parseInt(parts[1], 10);
      if (!Number.isFinite(newH)) return;
      if (iframe.src.includes(perma)) {
        var px = Math.min(Math.max(newH + 15, 300), Math.floor(window.innerHeight * 0.9));
        wrapper.style.height = px + 'px';
      }
    });

    return lightbox;
  }

  function closePopup(uid) {
    var lb = document.getElementById('zf-lightbox-' + uid);
    if (lb) lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  function makeIdFromUrl(url) { return btoa(url).replace(/[^a-z0-9]/gi, '').toLowerCase(); }
  function formUrlWithParam(url, param) { return url + (url.includes('?') ? '&' : '?') + param; }

  var originalAlert = window.alert;
  window.alert = function (msg) { if (typeof msg === 'string' && msg.toLowerCase().includes('redirecting to')) return; return originalAlert.apply(window, arguments); };
})();

// Reveal on scroll using IntersectionObserver
(function(){
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) { els.forEach(function(el){ el.classList.add('is-visible'); }); return; }
  var io = new IntersectionObserver(function(entries){ entries.forEach(function(entry){ if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();
