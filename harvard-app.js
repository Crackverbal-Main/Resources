// Harvard MBA Readiness Assessment JavaScript

// Scoring weights from the provided data
const scoringWeights = {
    gmat: {
        "750+": 25,
        "730-749": 20,
        "700-729": 15,
        "650-699": 10,
        "<650": 5
    },
    institution: {
        "IIT": 15,
        "NIT/BITS": 12,
        "Premier": 10,
        "State": 7,
        "Private": 5
    },
    experience: {
        "0-2": 5,
        "3-4": 15,
        "5-6": 20,
        "7+": 15
    },
    industry: {
        "Consulting": 20,
        "IB/PE": 20,
        "Tech": 15,
        "Startup": 12,
        "Others": 8
    },
    leadership: {
        "Founder": 15,
        "VP/Director": 12,
        "Manager": 8,
        "Team Lead": 5,
        "None": 0
    },
    company: {
        "Top Tier": 15,
        "Mid Tier": 10,
        "Startup": 8,
        "Local": 5
    },
    extracurricular: {
        "High": 10,
        "Medium": 7,
        "Low": 3
    }
};

const recommendations = {
    low: [
        "Focus on GMAT improvement to 750+",
        "Gain more leadership experience",
        "Develop your unique story",
        "Consider Round 2 application for more preparation time"
    ],
    medium: [
        "Polish your essays with compelling narratives",
        "Strengthen recommendation letters",
        "Apply in Round 1 for better odds",
        "Prepare thoroughly for interviews"
    ],
    high: [
        "You have strong credentials - focus on storytelling",
        "Apply to multiple top schools",
        "Consider early application strategies",
        "Leverage your strengths in essays"
    ]
};

const alternatives = [
    "Stanford GSB",
    "Wharton",
    "MIT Sloan", 
    "Columbia Business School",
    "Kellogg",
    "Booth",
    "ISB Hyderabad",
    "IIMs"
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeEventListeners();
    updateProgress();
});

function initializeEventListeners() {
    // Get DOM elements
    const form = document.getElementById('assessmentForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Form inputs
    const gmatInput = document.getElementById('gmatScore');
    const experienceSlider = document.getElementById('workExperience');
    const communitySlider = document.getElementById('communityService');
    const goalsSlider = document.getElementById('postMbaGoals');

    if (!form || !calculateBtn) {
        console.error('Required elements not found');
        return;
    }

    // Form change listeners for progress tracking
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', updateProgress);
        input.addEventListener('input', updateProgress);
    });

    // GMAT score indicator
    if (gmatInput) {
        gmatInput.addEventListener('input', updateGmatIndicator);
    }

    // Slider value updates
    if (experienceSlider) {
        experienceSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('experienceValue');
            if (valueDisplay) {
                valueDisplay.textContent = this.value;
            }
        });
    }

    if (communitySlider) {
        communitySlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('communityValue');
            if (valueDisplay) {
                valueDisplay.textContent = this.value;
            }
        });
    }

    if (goalsSlider) {
        goalsSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('goalsValue');
            if (valueDisplay) {
                valueDisplay.textContent = this.value;
            }
        });
    }

    // Calculate button
    calculateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Calculate button clicked');
        calculateReadiness();
    });

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetAssessment();
        });
    }

    console.log('Event listeners initialized');
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (!progressFill || !progressText) return;

    const form = document.getElementById('assessmentForm');
    if (!form) return;

    // Count required fields
    const requiredFields = [
        'gmatScore', 'gpaScore', 'institutionType', 'workExperience', 'industryType', 
        'companyTier', 'communityService', 'publicationsCount', 'uniqueStory', 'postMbaGoals'
    ];
    
    let completedFields = 0;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value && field.value.trim() !== '') {
            completedFields++;
        }
    });
    
    // Check leadership checkbox group
    const leadershipCheckboxes = document.querySelectorAll('input[name="leadership"]:checked');
    if (leadershipCheckboxes.length > 0) completedFields++;
    
    // Check awards checkbox group
    const awardsCheckboxes = document.querySelectorAll('input[name="awards"]:checked');
    if (awardsCheckboxes.length > 0) completedFields++;
    
    // Check research radio group
    const researchRadio = document.querySelector('input[name="harvardResearch"]:checked');
    if (researchRadio) completedFields++;
    
    const totalFields = requiredFields.length + 3; // +3 for checkbox and radio groups
    const progress = Math.round((completedFields / totalFields) * 100);
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress}% Complete`;
}

function updateGmatIndicator() {
    const gmatInput = document.getElementById('gmatScore');
    const gmatIndicator = document.getElementById('gmatIndicator');
    
    if (!gmatInput || !gmatIndicator) return;
    
    const score = parseInt(gmatInput.value);
    
    if (!score || score < 200 || score > 800) {
        gmatIndicator.textContent = '';
        gmatIndicator.className = 'score-indicator';
        return;
    }

    let message = '';
    let className = 'score-indicator ';

    if (score >= 750) {
        message = 'Excellent! This puts you in the top tier for Harvard.';
        className += 'excellent';
    } else if (score >= 720) {
        message = 'Good score! You\'re competitive for Harvard.';
        className += 'good';
    } else if (score >= 680) {
        message = 'Decent score, but consider retaking for Harvard.';
        className += 'needs-improvement';
    } else {
        message = 'Score needs significant improvement for Harvard.';
        className += 'needs-improvement';
    }

    gmatIndicator.textContent = message;
    gmatIndicator.className = className;
}

function calculateReadiness() {
    console.log('Starting calculation...');
    
    try {
        const formData = gatherFormData();
        console.log('Form data gathered:', formData);
        
        const scores = calculateScores(formData);
        console.log('Scores calculated:', scores);
        
        const overallScore = calculateOverallScore(scores);
        console.log('Overall score:', overallScore);
        
        displayResults(overallScore, scores, formData);
        
        // Scroll to results
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } catch (error) {
        console.error('Error in calculateReadiness:', error);
        alert('There was an error calculating your readiness score. Please check your inputs and try again.');
    }
}

function gatherFormData() {
    const formData = {
        gmat: parseInt(document.getElementById('gmatScore')?.value) || 0,
        gpa: document.getElementById('gpaScore')?.value || '',
        institution: document.getElementById('institutionType')?.value || '',
        experience: parseInt(document.getElementById('workExperience')?.value) || 0,
        industry: document.getElementById('industryType')?.value || '',
        leadership: [],
        company: document.getElementById('companyTier')?.value || '',
        community: parseInt(document.getElementById('communityService')?.value) || 0,
        awards: [],
        publications: parseInt(document.getElementById('publicationsCount')?.value) || 0,
        story: document.getElementById('uniqueStory')?.value || '',
        goals: parseInt(document.getElementById('postMbaGoals')?.value) || 1,
        research: null
    };

    // Gather leadership checkboxes
    const leadershipCheckboxes = document.querySelectorAll('input[name="leadership"]:checked');
    leadershipCheckboxes.forEach(cb => {
        formData.leadership.push(cb.value);
    });

    // Gather awards checkboxes
    const awardsCheckboxes = document.querySelectorAll('input[name="awards"]:checked');
    awardsCheckboxes.forEach(cb => {
        formData.awards.push(cb.value);
    });

    // Gather research radio
    const researchRadio = document.querySelector('input[name="harvardResearch"]:checked');
    if (researchRadio) {
        formData.research = researchRadio.value;
    }

    return formData;
}

function calculateScores(data) {
    const scores = {};

    // GMAT Score
    if (data.gmat >= 750) scores.gmat = scoringWeights.gmat["750+"];
    else if (data.gmat >= 730) scores.gmat = scoringWeights.gmat["730-749"];
    else if (data.gmat >= 700) scores.gmat = scoringWeights.gmat["700-729"];
    else if (data.gmat >= 650) scores.gmat = scoringWeights.gmat["650-699"];
    else scores.gmat = scoringWeights.gmat["<650"];

    // Institution
    scores.institution = scoringWeights.institution[data.institution] || 0;

    // Experience
    if (data.experience <= 2) scores.experience = scoringWeights.experience["0-2"];
    else if (data.experience <= 4) scores.experience = scoringWeights.experience["3-4"];
    else if (data.experience <= 6) scores.experience = scoringWeights.experience["5-6"];
    else scores.experience = scoringWeights.experience["7+"];

    // Industry
    scores.industry = scoringWeights.industry[data.industry] || 0;

    // Leadership
    let leadershipScore = 0;
    if (data.leadership.includes('Founder')) leadershipScore = scoringWeights.leadership["Founder"];
    else if (data.leadership.includes('VP/Director')) leadershipScore = scoringWeights.leadership["VP/Director"];
    else if (data.leadership.includes('Manager')) leadershipScore = scoringWeights.leadership["Manager"];
    else if (data.leadership.includes('Team Lead')) leadershipScore = scoringWeights.leadership["Team Lead"];
    scores.leadership = leadershipScore;

    // Company
    scores.company = scoringWeights.company[data.company] || 0;

    // Extracurricular (based on community service + awards)
    let extracurricularLevel = 'Low';
    if (data.community > 100 || data.awards.length > 2) extracurricularLevel = 'High';
    else if (data.community > 50 || data.awards.length > 0) extracurricularLevel = 'Medium';
    scores.extracurricular = scoringWeights.extracurricular[extracurricularLevel];

    // Bonus points
    scores.bonus = 0;
    if (data.story && data.story.length > 50) scores.bonus += 5;
    if (data.goals >= 4) scores.bonus += 3;
    if (data.research === 'yes') scores.bonus += 2;
    if (data.publications > 0) scores.bonus += 2;

    return scores;
}

function calculateOverallScore(scores) {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.min(100, total);
}

function displayResults(overallScore, scores, formData) {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) {
        console.error('Results section not found');
        return;
    }
    
    console.log('Displaying results with score:', overallScore);
    
    resultsSection.style.display = 'block';
    
    // Animate the score
    animateScore(overallScore);
    
    // Display risk assessment
    displayRiskAssessment(overallScore);
    
    // Display breakdown
    displayBreakdown(scores);
    
    // Display recommendations
    displayRecommendations(overallScore, formData);
    
    // Display timeline
    displayTimeline(overallScore);
    
    // Display alternatives
    displayAlternatives();
    
    // Add fade-in animation
    resultsSection.classList.add('fade-in-up');
}

function animateScore(score) {
    const scoreElement = document.getElementById('overallScore');
    const scoreCircle = document.querySelector('.score-circle');
    
    if (!scoreElement || !scoreCircle) return;
    
    // Animate the number
    let currentScore = 0;
    const increment = score / 50;
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(timer);
        }
        scoreElement.textContent = Math.round(currentScore);
    }, 20);
    
    // Animate the circle
    const percentage = (score / 100) * 360;
    scoreCircle.style.background = `conic-gradient(var(--harvard-crimson) ${percentage}deg, var(--harvard-light-gray) ${percentage}deg)`;
    
    scoreCircle.classList.add('score-animate');
}

function displayRiskAssessment(score) {
    const riskElement = document.getElementById('riskAssessment');
    if (!riskElement) return;
    
    let riskLevel, riskText, riskClass;
    
    if (score >= 75) {
        riskLevel = 'Strong Chance';
        riskText = 'You have a competitive profile for Harvard MBA';
        riskClass = 'risk-low';
    } else if (score >= 50) {
        riskLevel = 'Moderate Chance';
        riskText = 'With improvements, you could be competitive';
        riskClass = 'risk-medium';
    } else {
        riskLevel = 'Needs Improvement';
        riskText = 'Significant improvements needed for Harvard';
        riskClass = 'risk-high';
    }
    
    riskElement.innerHTML = `
        <h3>${riskLevel}</h3>
        <p>${riskText}</p>
    `;
    riskElement.className = `risk-assessment ${riskClass}`;
}

function displayBreakdown(scores) {
    const breakdownGrid = document.getElementById('breakdownGrid');
    if (!breakdownGrid) return;
    
    const categories = {
        gmat: 'GMAT Score',
        institution: 'Institution',
        experience: 'Work Experience',
        industry: 'Industry',
        leadership: 'Leadership',
        company: 'Company Prestige',
        extracurricular: 'Extracurricular',
        bonus: 'Bonus Points'
    };
    
    const maxScores = {
        gmat: 25,
        institution: 15,
        experience: 20,
        industry: 20,
        leadership: 15,
        company: 15,
        extracurricular: 10,
        bonus: 12
    };
    
    breakdownGrid.innerHTML = '';
    
    Object.entries(scores).forEach(([category, score]) => {
        const maxScore = maxScores[category];
        const percentage = (score / maxScore) * 100;
        
        const breakdownItem = document.createElement('div');
        breakdownItem.className = 'breakdown-item';
        breakdownItem.innerHTML = `
            <h4>${categories[category]}</h4>
            <div class="breakdown-score">${score}/${maxScore}</div>
            <div class="breakdown-bar">
                <div class="breakdown-fill" style="width: ${percentage}%"></div>
            </div>
            <small>${Math.round(percentage)}% of maximum</small>
        `;
        
        breakdownGrid.appendChild(breakdownItem);
    });
}

function displayRecommendations(score, formData) {
    const recommendationsElement = document.getElementById('recommendations');
    if (!recommendationsElement) return;
    
    let recList;
    
    if (score >= 75) recList = recommendations.high;
    else if (score >= 50) recList = recommendations.medium;
    else recList = recommendations.low;
    
    // Add personalized recommendations
    const personalizedRecs = [];
    
    if (formData.gmat < 720) {
        personalizedRecs.push('Prioritize GMAT improvement - aim for 750+ to be competitive');
    }
    
    if (formData.experience < 3) {
        personalizedRecs.push('Gain more work experience - 3-6 years is ideal for Harvard');
    }
    
    if (!formData.story || formData.story.length < 50) {
        personalizedRecs.push('Develop a compelling unique story that showcases your background');
    }
    
    if (formData.goals < 4) {
        personalizedRecs.push('Clarify your post-MBA goals - be specific about career plans');
    }
    
    const allRecommendations = [...recList, ...personalizedRecs];
    
    recommendationsElement.innerHTML = allRecommendations
        .map(rec => `<div class="recommendation-item">${rec}</div>`)
        .join('');
}

function displayTimeline(score) {
    const timelineElement = document.getElementById('timeline');
    if (!timelineElement) return;
    
    let timelineSteps;
    
    if (score >= 75) {
        timelineSteps = [
            { step: 1, text: 'Finalize school selection and application strategy', timeframe: 'Month 1-2' },
            { step: 2, text: 'Complete essays and gather recommendations', timeframe: 'Month 3-4' },
            { step: 3, text: 'Submit Round 1 applications', timeframe: 'Month 5' },
            { step: 4, text: 'Prepare for interviews', timeframe: 'Month 6-7' },
            { step: 5, text: 'Decision and enrollment', timeframe: 'Month 8-9' }
        ];
    } else if (score >= 50) {
        timelineSteps = [
            { step: 1, text: 'Focus on GMAT improvement and profile building', timeframe: 'Month 1-6' },
            { step: 2, text: 'Develop essays and unique story', timeframe: 'Month 7-9' },
            { step: 3, text: 'Submit Round 2 applications', timeframe: 'Month 10' },
            { step: 4, text: 'Interview preparation and execution', timeframe: 'Month 11-12' },
            { step: 5, text: 'Decision and next steps', timeframe: 'Month 13-14' }
        ];
    } else {
        timelineSteps = [
            { step: 1, text: 'Significant GMAT improvement (aim for 750+)', timeframe: 'Month 1-8' },
            { step: 2, text: 'Gain leadership experience and build profile', timeframe: 'Month 6-18' },
            { step: 3, text: 'Develop compelling application narrative', timeframe: 'Month 12-15' },
            { step: 4, text: 'Apply in next admission cycle', timeframe: 'Month 18-20' },
            { step: 5, text: 'Continue profile building if needed', timeframe: 'Ongoing' }
        ];
    }
    
    timelineElement.innerHTML = timelineSteps
        .map(item => `
            <div class="timeline-item">
                <div class="timeline-number">${item.step}</div>
                <div>
                    <strong>${item.text}</strong>
                    <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">${item.timeframe}</div>
                </div>
            </div>
        `).join('');
}

function displayAlternatives() {
    const alternativesElement = document.getElementById('alternatives');
    if (!alternativesElement) return;
    
    alternativesElement.innerHTML = alternatives
        .map(school => `<div class="alternative-item">${school}</div>`)
        .join('');
}

function resetAssessment() {
    const form = document.getElementById('assessmentForm');
    const resultsSection = document.getElementById('resultsSection');
    
    if (form) {
        form.reset();
    }
    
    // Reset display values
    const experienceValue = document.getElementById('experienceValue');
    const communityValue = document.getElementById('communityValue');
    const goalsValue = document.getElementById('goalsValue');
    const gmatIndicator = document.getElementById('gmatIndicator');
    
    if (experienceValue) experienceValue.textContent = '0';
    if (communityValue) communityValue.textContent = '0';
    if (goalsValue) goalsValue.textContent = '1';
    if (gmatIndicator) {
        gmatIndicator.textContent = '';
        gmatIndicator.className = 'score-indicator';
    }
    
    // Hide results
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    // Reset progress
    updateProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Real-time form validation
document.addEventListener('input', function(e) {
    if (e.target && e.target.matches('input, select, textarea')) {
        if (e.target.value.trim() !== '') {
            e.target.style.borderColor = 'var(--harvard-crimson)';
        } else {
            e.target.style.borderColor = '';
        }
    }
});