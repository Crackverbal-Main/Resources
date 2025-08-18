// MBA in UK 2025 — Interactive Functionality

// =====================
// University data (UK)
// =====================
const universities = [
  {"name": "London Business School", "ranking": 1, "gmat": 700, "acceptance": null, "tuition": 119950, "salary": 99333, "category": "Elite"},
  {"name": "University of Oxford (Saïd)", "ranking": 2, "gmat": 690, "acceptance": null, "tuition": 71440, "salary": 89000, "category": "Elite"},
  {"name": "University of Cambridge (Judge)", "ranking": 3, "gmat": 690, "acceptance": null, "tuition": 64000, "salary": 90000, "category": "Elite"},
  {"name": "Imperial College Business School", "ranking": 4, "gmat": 665, "acceptance": null, "tuition": 63400, "salary": 88000, "category": "High Value"},
  {"name": "Warwick Business School", "ranking": 5, "gmat": 655, "acceptance": null, "tuition": 53750, "salary": 82000, "category": "High ROI"},
  {"name": "Alliance Manchester Business School", "ranking": 6, "gmat": 650, "acceptance": null, "tuition": 47000, "salary": 80000, "category": "High ROI"},
  {"name": "Cranfield School of Management", "ranking": 7, "gmat": 650, "acceptance": null, "tuition": 44195, "salary": 78000, "category": "High ROI"},
  {"name": "Durham University Business School", "ranking": 8, "gmat": 640, "acceptance": null, "tuition": 37500, "salary": 73000, "category": "Value"},
  {"name": "Bayes (City, University of London)", "ranking": 9, "gmat": 650, "acceptance": null, "tuition": 50400, "salary": 78000, "category": "High Value"},
  {"name": "University of Edinburgh Business School", "ranking": 10, "gmat": 650, "acceptance": null, "tuition": 38500, "salary": 88000, "category": "Value"}
];

// =====================
// Application timeline
// =====================
const timelineData = [
  {"phase": "12–15 months before", "activities": "Self-reflection, target roles, initial research", "tips": "Check Student Route visa docs; begin financial planning"},
  {"phase": "10–12 months before", "activities": "GMAT/GRE prep, school networking, shortlist", "tips": "Note one-year formats; align timing with UK intake"},
  {"phase": "8–10 months before", "activities": "Take GMAT/GRE, finalize list, start essays", "tips": "Show impact/leadership; highlight international exposure"},
  {"phase": "6–8 months before", "activities": "Essays, recommender briefing, CV revamp", "tips": "Explain UK fit: sectors, location, post-study plan"},
  {"phase": "4–6 months before", "activities": "Complete applications; request transcripts", "tips": "Prepare for interviews; mock with UK-style examples"},
  {"phase": "2–4 months before", "activities": "Submit applications; interview prep", "tips": "Know Graduate Route & Skilled Worker basics"},
  {"phase": "1–2 months before", "activities": "Interview rounds; scholarships", "tips": "Track CAS & funding proof timelines"},
  {"phase": "Application deadline", "activities": "Final submissions; follow-ups", "tips": "Consider multi-round strategy across schools"}
];

// =====================
// Quiz
// =====================
let currentQuestion = 1;
let quizAnswers = {};

window.nextQuestion = function() {
  const currentQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
  if (!currentQuestionElement) return;

  const selectedAnswer = currentQuestionElement.querySelector('input[type="radio"]:checked');
  if (!selectedAnswer) {
    alert('Please select an answer before proceeding.');
    return;
  }

  quizAnswers[`q${currentQuestion}`] = selectedAnswer.value;

  if (currentQuestion < 5) {
    currentQuestionElement.classList.remove('active');
    currentQuestion++;
    const nextQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
    if (nextQuestionElement) nextQuestionElement.classList.add('active');
    updateQuizNavigation();
  } else {
    showQuizResult();
  }
};

window.previousQuestion = function() {
  if (currentQuestion > 1) {
    const currentQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
    if (currentQuestionElement) currentQuestionElement.classList.remove('active');
    currentQuestion--;
    const prevQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
    if (prevQuestionElement) prevQuestionElement.classList.add('active');
    updateQuizNavigation();
  }
};

function updateQuizNavigation() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.disabled = currentQuestion === 1;
  if (nextBtn) nextBtn.textContent = currentQuestion === 5 ? 'See Results' : 'Next';
}

function showQuizResult() {
  let score = 0;
  if (quizAnswers.q1 === '3-5' || quizAnswers.q1 === '6+') score += 25;
  if (quizAnswers.q2 === '700-729' || quizAnswers.q2 === '730+') score += 25;
  if (quizAnswers.q3 === '200-250k' || quizAnswers.q3 === '250k+') score += 20;
  if (quizAnswers.q4) score += 15;
  if (quizAnswers.q5 === 'somewhat' || quizAnswers.q5 === 'well-prepared') score += 15;

  const currentQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
  if (currentQuestionElement) currentQuestionElement.classList.remove('active');

  const resultElement = document.getElementById('quiz-result');
  const navigationElement = document.querySelector('.quiz-navigation');
  if (resultElement) resultElement.style.display = 'block';
  if (navigationElement) navigationElement.style.display = 'none';

  const scoreValueElement = document.getElementById('score-value');
  if (scoreValueElement) scoreValueElement.textContent = score;

  let interpretation = '';
  if (score >= 80) {
    interpretation = 'Excellent! You’re well-prepared for a UK MBA application. Consider applying to top-tier schools.';
  } else if (score >= 60) {
    interpretation = 'Good preparation! You’re on the right track. Sharpen essays and interview stories.';
  } else if (score >= 40) {
    interpretation = 'Moderate preparation. Focus on GMAT/GRE and funding plan.';
  } else {
    interpretation = 'Early stage. Start with goal clarity and GMAT/GRE prep.';
  }

  const interpretationElement = document.getElementById('score-interpretation');
  if (interpretationElement) interpretationElement.textContent = interpretation;
}

// =====================
// Universities display
// =====================
function displayUniversities(universitiesToShow = universities) {
  const grid = document.getElementById('universities-grid');
  if (!grid) return;

  grid.innerHTML = universitiesToShow.map(uni => `
    <div class="university-card">
      <h3>${uni.name}</h3>
      <div class="university-meta">
        <span class="status status--info">Rank #${uni.ranking}</span>
        <span class="status ${getCategoryClass(uni.category)}">${uni.category}</span>
      </div>
      <div class="university-stats">
        <div class="stat-item">
          <span class="value">${uni.gmat}</span>
          <span class="label">Avg GMAT</span>
        </div>
        <div class="stat-item">
          <span class="value">${uni.acceptance == null ? '—' : uni.acceptance + '%'}</span>
          <span class="label">Acceptance</span>
        </div>
        <div class="stat-item">
          <span class="value">£${(uni.tuition/1000).toFixed(0)}k</span>
          <span class="label">Tuition</span>
        </div>
        <div class="stat-item">
          <span class="value">£${(uni.salary/1000).toFixed(0)}k</span>
          <span class="label">Avg Salary</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryClass(category) {
  switch (category) {
    case 'Elite': return 'status--error';
    case 'High Value': return 'status--warning';
    case 'High ROI': return 'status--success';
    case 'Value': return 'status--info';
    default: return 'status--info';
  }
}

// =====================
// Filters (optional UI)
// =====================
function setupFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const gmatFilter = document.getElementById('gmat-filter');
  const acceptanceFilter = document.getElementById('acceptance-filter');

  function applyFilters() {
    let filtered = universities;

    if (categoryFilter && categoryFilter.value !== 'all') {
      filtered = filtered.filter(uni => uni.category === categoryFilter.value);
    }
    if (gmatFilter && gmatFilter.value !== 'all') {
      const range = gmatFilter.value;
      filtered = filtered.filter(uni => {
        if (range === '650-669') return uni.gmat >= 650 && uni.gmat <= 669;
        if (range === '670-689') return uni.gmat >= 670 && uni.gmat <= 689;
        if (range === '690+') return uni.gmat >= 690;
        return true;
      });
    }
    if (acceptanceFilter && acceptanceFilter.value !== 'all') {
      const range = acceptanceFilter.value;
      filtered = filtered.filter(uni => {
        if (uni.acceptance == null) return false;
        if (range === '0-20') return uni.acceptance <= 20;
        if (range === '20-30') return uni.acceptance > 20 && uni.acceptance <= 30;
        if (range === '30+') return uni.acceptance > 30;
        return true;
      });
    }
    displayUniversities(filtered);
  }

  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (gmatFilter) gmatFilter.addEventListener('change', applyFilters);
  if (acceptanceFilter) acceptanceFilter.addEventListener('change', applyFilters);
}

// =====================
// Cost calculator (UK)
// =====================
function setupCostCalculator() {
  const universitySelect = document.getElementById('university-select');
  const livingExpenses = document.getElementById('living-expenses');
  const booksSupplies = document.getElementById('books-supplies');
  const personalExpenses = document.getElementById('personal-expenses');

  if (!universitySelect) return;

  // Populate select
  universities.forEach(uni => {
    const option = document.createElement('option');
    option.value = JSON.stringify(uni);
    option.textContent = uni.name;
    universitySelect.appendChild(option);
  });

  function calculateCosts() {
    const selectedUni = universitySelect.value;
    if (!selectedUni) return;

    const uni = JSON.parse(selectedUni);
    const monthly = livingExpenses ? parseInt(livingExpenses.value) : 1200;
    const books = booksSupplies ? parseInt(booksSupplies.value) : 1000;
    const personal = personalExpenses ? parseInt(personalExpenses.value) : 2000;

    // UK MBA typically ~12 months
    const tuitionCost = uni.tuition;     // 1 year
    const livingCost = monthly * 12;     // 12 months
    const booksCost = books;             // per programme
    const personalCost = personal;       // per programme
    const totalCost = tuitionCost + livingCost + booksCost + personalCost;

    const tuitionElement = document.getElementById('tuition-cost');
    const livingElement = document.getElementById('living-cost');
    const booksElement = document.getElementById('books-cost');
    const personalElement = document.getElementById('personal-cost');
    const totalElement = document.getElementById('total-cost');

    if (tuitionElement) tuitionElement.textContent = formatCurrencyGBP(tuitionCost);
    if (livingElement) livingElement.textContent = formatCurrencyGBP(livingCost);
    if (booksElement) booksElement.textContent = formatCurrencyGBP(booksCost);
    if (personalElement) personalElement.textContent = formatCurrencyGBP(personalCost);
    if (totalElement) totalElement.textContent = formatCurrencyGBP(totalCost);

    // ROI
    const expectedSalary = uni.salary;
    const paybackPeriod = expectedSalary > 0 ? (totalCost / expectedSalary).toFixed(1) : '—';

    const salaryElement = document.getElementById('expected-salary');
    const paybackElement = document.getElementById('payback-period');
    if (salaryElement) salaryElement.textContent = formatCurrencyGBP(expectedSalary);
    if (paybackElement) paybackElement.textContent = `${paybackPeriod} years`;
  }

  universitySelect.addEventListener('change', calculateCosts);
  if (livingExpenses) livingExpenses.addEventListener('change', calculateCosts);
}

// =====================
// Timeline
// =====================
function displayTimeline() {
  const timelineContainer = document.getElementById('application-timeline');
  if (!timelineContainer) return;

  timelineContainer.innerHTML = timelineData.map(item => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-phase">${item.phase}</div>
        <div class="timeline-activities">${item.activities}</div>
        <div class="timeline-tips"><strong>Tips for Indians:</strong> ${item.tips}</div>
      </div>
    </div>
  `).join('');
}

// =====================
// Tools & nav
// =====================
window.openTool = function(toolType) {
  // Placeholder for future interactive tools
};

window.scrollToSection = function(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) element.scrollIntoView({ behavior: 'smooth' });
};

function setupNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        scrollToSection(targetId);
        if (navMenu) navMenu.classList.remove('active');
      }
    });
  });
}

// =====================
// Init
// =====================
document.addEventListener('DOMContentLoaded', function() {
  displayUniversities();
  setupFilters();
  setupCostCalculator();
  displayTimeline();
  setupNavigation();

  // CTA buttons (keep but UK-specific message)
  setTimeout(() => {
    document.querySelectorAll('.btn--primary').forEach(button => {
      if (button.textContent.includes('Book Free Consultation') || button.textContent.includes('Free MBA Consultation')) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Redirecting to Crackverbal consultation booking…\n\nCall: +91-9555-444-333\nEmail: info@crackverbal.com');
        });
      }
    });

    document.querySelectorAll('.btn--outline').forEach(button => {
      if (button.textContent.includes('Learn More') || button.textContent.includes('GMAT Prep Course')) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Redirecting to Crackverbal GMAT Prep Course details…\n\nVisit: www.crackverbal.com/gmat-prep');
        });
      }
    });
  }, 100);
});

// =====================
// Utils
// =====================
function formatCurrencyGBP(amount) {
  if (amount == null || isNaN(amount)) return '£0';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatCurrency(amount) { // legacy
  return formatCurrencyGBP(amount);
}

function getUniversityByName(name) {
  return universities.find(uni => uni.name === name);
}

function filterUniversitiesByCategory(category) {
  return universities.filter(uni => uni.category === category);
}

function sortUniversitiesByRanking() {
  return [...universities].sort((a, b) => a.ranking - b.ranking);
}

function sortUniversitiesByGMAT() {
  return [...universities].sort((a, b) => b.gmat - a.gmat);
}

function sortUniversitiesByAcceptance() {
  return [...universities].sort((a, b) => {
    const av = a.acceptance ?? Infinity, bv = b.acceptance ?? Infinity;
    return av - bv;
  });
}

function sortUniversitiesBySalary() {
  return [...universities].sort((a, b) => b.salary - a.salary);
}
