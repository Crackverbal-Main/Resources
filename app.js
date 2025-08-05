// MBA Blog Interactive Functionality

// University data
const universities = [
    {"name": "Stanford GSB", "ranking": 1, "gmat": 738, "acceptance": 6.8, "tuition": 82455, "salary": 182500, "category": "Dream Schools"},
    {"name": "Wharton (UPenn)", "ranking": 2, "gmat": 733, "acceptance": 20.7, "tuition": 84830, "salary": 175000, "category": "Dream Schools"},
    {"name": "Harvard Business School", "ranking": 3, "gmat": 730, "acceptance": 11.2, "tuition": 76410, "salary": 175000, "category": "Dream Schools"},
    {"name": "MIT Sloan", "ranking": 4, "gmat": 740, "acceptance": 14.1, "tuition": 84350, "salary": 165000, "category": "Dream Schools"},
    {"name": "Columbia Business School", "ranking": 5, "gmat": 727, "acceptance": 22.0, "tuition": 88300, "salary": 175000, "category": "Dream Schools"},
    {"name": "Chicago Booth", "ranking": 6, "gmat": 731, "acceptance": 28.7, "tuition": 80961, "salary": 170000, "category": "Sweet Spot Schools"},
    {"name": "Northwestern Kellogg", "ranking": 7, "gmat": 730, "acceptance": 23.0, "tuition": 81015, "salary": 175000, "category": "Sweet Spot Schools"},
    {"name": "UC Berkeley Haas", "ranking": 8, "gmat": 727, "acceptance": 19.0, "tuition": 82059, "salary": 170000, "category": "Sweet Spot Schools"},
    {"name": "Yale SOM", "ranking": 9, "gmat": 730, "acceptance": 25.0, "tuition": 84900, "salary": 165000, "category": "Sweet Spot Schools"},
    {"name": "NYU Stern", "ranking": 10, "gmat": 729, "acceptance": 26.0, "tuition": 84180, "salary": 175000, "category": "Sweet Spot Schools"},
    {"name": "Cornell Johnson", "ranking": 14, "gmat": 720, "acceptance": 31.0, "tuition": 83106, "salary": 165000, "category": "Sweet Spot Schools"},
    {"name": "UCLA Anderson", "ranking": 13, "gmat": 715, "acceptance": 24.0, "tuition": 78268, "salary": 172000, "category": "High ROI Schools"},
    {"name": "CMU Tepper", "ranking": 19, "gmat": 710, "acceptance": 29.0, "tuition": 78362, "salary": 161000, "category": "High ROI Schools"},
    {"name": "Duke Fuqua", "ranking": 13, "gmat": 720, "acceptance": 22.0, "tuition": 77925, "salary": 175000, "category": "Sweet Spot Schools"},
    {"name": "Michigan Ross", "ranking": 12, "gmat": 730, "acceptance": 38.0, "tuition": 75392, "salary": 175000, "category": "High ROI Schools"}
];

// Application timeline data
const timelineData = [
    {"phase": "12-15 months before", "activities": "Self-reflection, career goal setting, initial research", "tips": "Research visa requirements, start financial planning"},
    {"phase": "10-12 months before", "activities": "GMAT/GRE preparation, school research, networking", "tips": "Consider time zones for online tests, prep during work hours"},
    {"phase": "8-10 months before", "activities": "Take GMAT/GRE, finalize school list, start essays", "tips": "Focus on unique experiences that differentiate from other Indian applicants"},
    {"phase": "6-8 months before", "activities": "Essay writing, recommender selection, resume crafting", "tips": "Highlight leadership in diverse teams, international exposure"},
    {"phase": "4-6 months before", "activities": "Complete applications, request transcripts, practice interviews", "tips": "Prepare for potential visa delays, have backup plans"},
    {"phase": "2-4 months before", "activities": "Submit applications, interview preparation", "tips": "Practice interviews in English, prepare for cultural questions"},
    {"phase": "1-2 months before", "activities": "Interview rounds, scholarship applications", "tips": "Research current political climate impact on visas"},
    {"phase": "Application deadline", "activities": "Final submissions, follow-up communications", "tips": "Consider multiple round applications for better chances"}
];

// Quiz functionality
let currentQuestion = 1;
let quizAnswers = {};

// Make functions global so they can be called from HTML
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
        if (nextQuestionElement) {
            nextQuestionElement.classList.add('active');
        }
        updateQuizNavigation();
    } else {
        showQuizResult();
    }
}

window.previousQuestion = function() {
    if (currentQuestion > 1) {
        const currentQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
        if (currentQuestionElement) {
            currentQuestionElement.classList.remove('active');
        }
        currentQuestion--;
        const prevQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
        if (prevQuestionElement) {
            prevQuestionElement.classList.add('active');
        }
        updateQuizNavigation();
    }
}

function updateQuizNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = currentQuestion === 1;
    if (nextBtn) nextBtn.textContent = currentQuestion === 5 ? 'See Results' : 'Next';
}

function showQuizResult() {
    let score = 0;
    
    // Calculate score based on answers
    if (quizAnswers.q1 === '3-5' || quizAnswers.q1 === '6+') score += 25;
    if (quizAnswers.q2 === '700-729' || quizAnswers.q2 === '730+') score += 25;
    if (quizAnswers.q3 === '200-250k' || quizAnswers.q3 === '250k+') score += 20;
    if (quizAnswers.q4) score += 15;
    if (quizAnswers.q5 === 'somewhat' || quizAnswers.q5 === 'well-prepared') score += 15;
    
    const currentQuestionElement = document.querySelector(`[data-question="${currentQuestion}"]`);
    if (currentQuestionElement) {
        currentQuestionElement.classList.remove('active');
    }
    
    const resultElement = document.getElementById('quiz-result');
    const navigationElement = document.querySelector('.quiz-navigation');
    
    if (resultElement) resultElement.style.display = 'block';
    if (navigationElement) navigationElement.style.display = 'none';
    
    const scoreValueElement = document.getElementById('score-value');
    if (scoreValueElement) scoreValueElement.textContent = score;
    
    let interpretation = '';
    if (score >= 80) {
        interpretation = 'Excellent! You\'re well-prepared for an MBA application. Consider applying to top-tier schools.';
    } else if (score >= 60) {
        interpretation = 'Good preparation! You\'re on the right track. Focus on strengthening weak areas.';
    } else if (score >= 40) {
        interpretation = 'Moderate preparation. Consider spending more time on GMAT prep and financial planning.';
    } else {
        interpretation = 'Early stage preparation. Start with GMAT prep and career goal clarification.';
    }
    
    const interpretationElement = document.getElementById('score-interpretation');
    if (interpretationElement) interpretationElement.textContent = interpretation;
}

// University filtering and display
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
                    <span class="value">${uni.acceptance}%</span>
                    <span class="label">Acceptance</span>
                </div>
                <div class="stat-item">
                    <span class="value">$${(uni.tuition/1000).toFixed(0)}k</span>
                    <span class="label">Tuition</span>
                </div>
                <div class="stat-item">
                    <span class="value">$${(uni.salary/1000).toFixed(0)}k</span>
                    <span class="label">Avg Salary</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryClass(category) {
    switch (category) {
        case 'Dream Schools': return 'status--error';
        case 'Sweet Spot Schools': return 'status--warning';
        case 'High ROI Schools': return 'status--success';
        default: return 'status--info';
    }
}

// Filter functionality
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
                if (range === '700-719') return uni.gmat >= 700 && uni.gmat <= 719;
                if (range === '720-729') return uni.gmat >= 720 && uni.gmat <= 729;
                if (range === '730+') return uni.gmat >= 730;
                return true;
            });
        }
        
        if (acceptanceFilter && acceptanceFilter.value !== 'all') {
            const range = acceptanceFilter.value;
            filtered = filtered.filter(uni => {
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

// Cost calculator
function setupCostCalculator() {
    const universitySelect = document.getElementById('university-select');
    const livingExpenses = document.getElementById('living-expenses');
    const booksSupplies = document.getElementById('books-supplies');
    const personalExpenses = document.getElementById('personal-expenses');
    
    if (!universitySelect) return;
    
    // Populate university select
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
        const monthly = livingExpenses ? parseInt(livingExpenses.value) : 2000;
        const books = booksSupplies ? parseInt(booksSupplies.value) : 3000;
        const personal = personalExpenses ? parseInt(personalExpenses.value) : 2000;
        
        const tuitionCost = uni.tuition * 2; // 2 years
        const livingCost = monthly * 24; // 24 months
        const booksCost = books * 2; // 2 years
        const personalCost = personal * 2; // 2 years
        const totalCost = tuitionCost + livingCost + booksCost + personalCost;
        
        const tuitionElement = document.getElementById('tuition-cost');
        const livingElement = document.getElementById('living-cost');
        const booksElement = document.getElementById('books-cost');
        const personalElement = document.getElementById('personal-cost');
        const totalElement = document.getElementById('total-cost');
        
        if (tuitionElement) tuitionElement.textContent = `$${tuitionCost.toLocaleString()}`;
        if (livingElement) livingElement.textContent = `$${livingCost.toLocaleString()}`;
        if (booksElement) booksElement.textContent = `$${booksCost.toLocaleString()}`;
        if (personalElement) personalElement.textContent = `$${personalCost.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `$${totalCost.toLocaleString()}`;
        
        // ROI calculation
        const expectedSalary = uni.salary;
        const paybackPeriod = (totalCost / expectedSalary).toFixed(1);
        
        const salaryElement = document.getElementById('expected-salary');
        const paybackElement = document.getElementById('payback-period');
        
        if (salaryElement) salaryElement.textContent = `$${expectedSalary.toLocaleString()}`;
        if (paybackElement) paybackElement.textContent = `${paybackPeriod} years`;
    }
    
    universitySelect.addEventListener('change', calculateCosts);
    if (livingExpenses) livingExpenses.addEventListener('change', calculateCosts);
}

// Application timeline
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

// Interactive tools
window.openTool = function(toolType) {
    switch (toolType) {
        case 'comparison':
            //alert('University Comparison Tool - Coming Soon! This would allow you to compare universities side by side.');
            break;
        case 'gmat':
            //alert('GMAT Score Predictor - Coming Soon! This would help predict your GMAT score based on practice tests.');
            break;
        case 'timeline':
            //alert('Application Timeline Tracker - Coming Soon! This would create a personalized timeline for your applications.');
            break;
    }
}

// Smooth scrolling
window.scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navigation menu functionality
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Add smooth scrolling to nav links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                scrollToSection(targetId);
                
                // Close mobile menu if open
                if (navMenu) navMenu.classList.remove('active');
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Display universities
    displayUniversities();
    
    // Setup filters
    setupFilters();
    
    // Setup cost calculator
    setupCostCalculator();
    
    // Display timeline
    displayTimeline();
    
    // Setup navigation
    setupNavigation();
    
    // Add event listeners for CTA buttons
    setTimeout(() => {
        document.querySelectorAll('.btn--primary').forEach(button => {
            if (button.textContent.includes('Book Free Consultation') || button.textContent.includes('Free MBA Consultation')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Redirecting to Crackverbal consultation booking...\n\nCall: +91-9555-444-333\nEmail: info@crackverbal.com');
                });
            }
        });
        
        document.querySelectorAll('.btn--outline').forEach(button => {
            if (button.textContent.includes('Learn More') || button.textContent.includes('GMAT Prep Course')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Redirecting to Crackverbal GMAT Prep Course details...\n\nVisit: www.crackverbal.com/gmat-prep');
                });
            }
        });
        
        // Add event listeners for tool buttons
        document.querySelectorAll('.tool-card .btn--primary').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const toolCard = button.closest('.tool-card');
                if (toolCard) {
                    const toolTitle = toolCard.querySelector('h3').textContent;
                    if (toolTitle.includes('Comparison')) {
                        openTool('comparison');
                    } else if (toolTitle.includes('GMAT')) {
                        openTool('gmat');
                    } else if (toolTitle.includes('Timeline')) {
                        openTool('timeline');
                    }
                }
            });
        });
    }, 100);
});

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
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
    return [...universities].sort((a, b) => a.acceptance - b.acceptance);
}

function sortUniversitiesBySalary() {
    return [...universities].sort((a, b) => b.salary - a.salary);
}
