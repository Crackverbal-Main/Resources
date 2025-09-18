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

// =========================
// Quiz interactions (Next/Prev, scoring)
// =========================
(function(){
  var container = document.getElementById('quiz');
  if (!container) return;
  var questions = Array.prototype.slice.call(container.querySelectorAll('.quiz-question'));
  if (!questions.length) return;
  var idx = questions.findIndex(function(q){ return q.classList.contains('active'); });
  if (idx < 0) idx = 0; questions[idx].classList.add('active');

  var nextBtn = container.querySelector('#next-btn');
  var prevBtn = container.querySelector('#prev-btn');
  var resultEl = container.querySelector('#quiz-result');
  var scoreVal = container.querySelector('#score-value');
  var scoreInterpret = container.querySelector('#score-interpretation');

  function show(i){
    questions.forEach(function(q){ q.classList.remove('active'); });
    questions[i].classList.add('active');
    prevBtn.disabled = i === 0;
    nextBtn.textContent = (i === questions.length - 1) ? 'Finish' : 'Next';
  }

  function computeScore(){
    // Simple scoring map; can be tuned
    var weights = {
      q1: { '0-2': 15, '3-5': 20, '6+': 25 },
      q2: { '650-699': 10, '700-729': 18, '730+': 25 },
      q3: { '150-200k': 15, '200-250k': 20, '250k+': 22 },
      q4: { consulting: 20, finance: 20, tech: 18, entrepreneurship: 22 },
      q5: { 'not-prepared': 10, 'somewhat': 18, 'well-prepared': 24 }
    };
    var total = 0; var max = 25+25+22+22+24; // 118
    Object.keys(weights).forEach(function(name){
      var sel = container.querySelector('input[name="'+name+'"]:checked');
      if (sel) total += (weights[name][sel.value] || 0);
    });
    // Normalize to 100
    var normalized = Math.round((total / max) * 100);
    return Math.max(0, Math.min(100, normalized));
  }

  function interpretation(score){
    if (score >= 80) return 'Excellent readiness. You have a strong profile and clear plan.';
    if (score >= 60) return 'Good readiness. A targeted strategy and polish will maximize outcomes.';
    if (score >= 40) return 'Moderate readiness. Focus on score, story, and school fit to elevate.';
    return 'Early-stage readiness. Build foundations: test prep, story, and research.';
  }

  if (nextBtn) nextBtn.addEventListener('click', function(){
    if (idx < questions.length - 1) { idx++; show(idx); return; }
    // Finish
    var s = computeScore();
    if (scoreVal) scoreVal.textContent = s;
    if (scoreInterpret) scoreInterpret.textContent = interpretation(s);
    if (resultEl) resultEl.style.display = 'block';
  });
  if (prevBtn) prevBtn.addEventListener('click', function(){ idx = Math.max(0, idx - 1); show(idx); });
  show(idx);
})();

// =========================
// Cost Calculator interactions
// =========================
(function(){
  var uniSelect = document.getElementById('university-select');
  var livingSel = document.getElementById('living-expenses');
  var booksInput = document.getElementById('books-supplies');
  var personalInput = document.getElementById('personal-expenses');
  var tuitionCost = document.getElementById('tuition-cost');
  var livingCost = document.getElementById('living-cost');
  var booksCost = document.getElementById('books-cost');
  var personalCost = document.getElementById('personal-cost');
  var totalCost = document.getElementById('total-cost');
  var expSalary = document.getElementById('expected-salary');
  var payback = document.getElementById('payback-period');
  if (!uniSelect || !livingSel) return;

  // Mapping (USD, two-year tuition) + expected salary benchmark
  var UNI = {
    'Harvard Business School': { tuition2y: 152820, salary: 185000 },
    'Stanford GSB': { tuition2y: 158400, salary: 185000 },
    'Wharton': { tuition2y: 162000, salary: 180000 },
    'MIT Sloan': { tuition2y: 164000, salary: 175000 },
    'Columbia Business School': { tuition2y: 176600, salary: 175000 },
    'Chicago Booth': { tuition2y: 164000, salary: 170000 },
    'Northwestern Kellogg': { tuition2y: 164000, salary: 170000 },
    'UC Berkeley Haas': { tuition2y: 158000, salary: 170000 },
    'Yale SOM': { tuition2y: 154000, salary: 165000 }
  };

  // Populate if empty
  if (uniSelect.options.length <= 1) {
    Object.keys(UNI).forEach(function(name){
      var opt = document.createElement('option');
      opt.value = name; opt.textContent = name; uniSelect.appendChild(opt);
    });
  }

  function num(v){ var n = parseFloat(v); return Number.isFinite(n)? n : 0; }
  function money(n){ return '$' + n.toLocaleString('en-US'); }

  function recalc(){
    var u = UNI[uniSelect.value];
    var tuition = u ? u.tuition2y : 0;
    var livingMonthly = num(livingSel.value);
    var living = livingMonthly * 24;
    var books = num(booksInput.value || 3000) * 2 / 2; // already 3000 total
    var personal = num(personalInput.value || 2000) * 2 / 2; // already 2000 total
    var total = tuition + living + 6000 + 4000; // books-cost + personal-cost reflect 6000/4000 in UI

    if (tuitionCost) tuitionCost.textContent = money(tuition);
    if (livingCost) livingCost.textContent = money(living);
    if (booksCost) booksCost.textContent = money(6000);
    if (personalCost) personalCost.textContent = money(4000);
    if (totalCost) totalCost.textContent = money(total);

    var salary = (u && u.salary) ? u.salary : 165000;
    if (expSalary) expSalary.textContent = money(salary);
    var pb = total / Math.max(1, (salary * 0.75)); // conservative: 75% of starting salary available for payback
    if (payback) payback.textContent = pb.toFixed(1) + ' years';
  }

  uniSelect.addEventListener('change', recalc);
  livingSel.addEventListener('change', recalc);
  recalc();
})();
