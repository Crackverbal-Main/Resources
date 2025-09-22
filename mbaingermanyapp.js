// MBA Germany Interactive Application
class MBAGermanyApp {
    constructor() {
        this.universities = [
            {
                name: "Mannheim Business School",
                location: "Mannheim",
                tuition_eur: 45000,
                duration_months: 12,
                avg_salary_eur: 100000,
                gmat_min: 600,
                work_exp_years: 3,
                application_fee: 130,
                ranking: 47,
                accreditation: ["AMBA", "EQUIS", "AACSB"]
            },
            {
                name: "Frankfurt School of Finance & Management",
                location: "Frankfurt",
                tuition_eur: 42000,
                duration_months: 12,
                avg_salary_eur: 95000,
                gmat_min: 600,
                work_exp_years: 3,
                application_fee: 150,
                ranking: 40,
                accreditation: ["AMBA", "EQUIS"]
            },
            {
                name: "WHU Otto Beisheim",
                location: "Düsseldorf",
                tuition_eur: 48500,
                duration_months: 12,
                avg_salary_eur: 105000,
                gmat_min: 650,
                work_exp_years: 3,
                application_fee: 100,
                ranking: 55,
                accreditation: ["AMBA", "EQUIS", "AACSB"]
            },
            {
                name: "ESMT Berlin",
                location: "Berlin",
                tuition_eur: 49000,
                duration_months: 15,
                avg_salary_eur: 100000,
                gmat_min: 650,
                work_exp_years: 4,
                application_fee: 50,
                ranking: 78,
                accreditation: ["AMBA", "EQUIS", "AACSB"]
            },
            {
                name: "HHL Leipzig",
                location: "Leipzig",
                tuition_eur: 41600,
                duration_months: 21,
                avg_salary_eur: 85000,
                gmat_min: 650,
                work_exp_years: 2,
                application_fee: 0,
                ranking: 140,
                accreditation: ["AMBA", "EQUIS", "AACSB"]
            },
            {
                name: "Munich Business School",
                location: "Munich",
                tuition_eur: 32000,
                duration_months: 12,
                avg_salary_eur: 80000,
                gmat_min: 600,
                work_exp_years: 2,
                application_fee: 75,
                ranking: 200,
                accreditation: ["FIBAA"]
            },
            {
                name: "GISMA Business School",
                location: "Berlin",
                tuition_eur: 18000,
                duration_months: 12,
                avg_salary_eur: 70000,
                gmat_min: 550,
                work_exp_years: 2,
                application_fee: 100,
                ranking: 300,
                accreditation: ["AMBA"]
            }
        ];

        this.specializations = [
            {name: "Finance", avg_salary: 114000},
            {name: "Consulting", avg_salary: 140000},
            {name: "Technology", avg_salary: 120000},
            {name: "Healthcare", avg_salary: 125000},
            {name: "Marketing", avg_salary: 72000},
            {name: "Operations", avg_salary: 92000},
            {name: "General Management", avg_salary: 101000}
        ];

        this.livingCosts = {
            accommodation: 700,
            food: 260,
            utilities: 300,
            transport: 50,
            misc: 100
        };

        this.selectedSchools = [];
        this.userProfile = {};
        this.currentQuizQuestion = 1;
        this.totalQuizQuestions = 5;

        this.init();
    }

    init() {
        console.log('Initializing MBA Germany App...');
        
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            this.setupNavigation();
            this.setupUniversityComparison();
            this.setupCostCalculator();
            this.setupEligibilityChecker();
            this.setupSalaryChart();
            this.setupCTAButtons();
            this.setupQuiz();
            console.log('App initialization complete');
        }, 100);
    }

    setupNavigation() {
        console.log('Setting up navigation...');
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        console.log(`Found ${navItems.length} nav items and ${sections.length} sections`);

        navItems.forEach((item, index) => {
            console.log(`Setting up nav item ${index}: ${item.getAttribute('data-section')}`);
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Nav item clicked:', item.getAttribute('data-section'));
                const targetSection = item.getAttribute('data-section');
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Show target section
                sections.forEach(section => section.classList.remove('active'));
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                    console.log(`Switched to section: ${targetSection}`);
                    
                    // Smooth scroll to top of content
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.error(`Section not found: ${targetSection}`);
                }
            });
        });
    }

    setupUniversityComparison() {
        console.log('Setting up university comparison...');
        const checkboxContainer = document.getElementById('schoolCheckboxes');
        const compareBtn = document.getElementById('compareBtn');
        const resultsContainer = document.getElementById('comparisonResults');

        if (!checkboxContainer || !compareBtn) {
            console.error('Comparison elements not found');
            return;
        }

        // Create checkboxes for each university
        this.universities.forEach((university, index) => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-item';
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="school-${index}" value="${index}">
                <label for="school-${index}">${university.name}</label>
            `;
            checkboxContainer.appendChild(checkboxDiv);
        });

        // Handle checkbox selection (max 3)
        checkboxContainer.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const checkedBoxes = checkboxContainer.querySelectorAll('input:checked');
                if (checkedBoxes.length > 3) {
                    e.target.checked = false;
                    alert('Please select maximum 3 schools for comparison');
                    return;
                }
                this.selectedSchools = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
                console.log('Selected schools:', this.selectedSchools);
            }
        });

        compareBtn.addEventListener('click', () => {
            console.log('Compare button clicked, selected schools:', this.selectedSchools);
            if (this.selectedSchools.length === 0) {
                alert('Please select at least one school to compare');
                return;
            }
            this.displayComparison();
        });
    }

    displayComparison() {
        console.log('Displaying comparison...');
        const resultsContainer = document.getElementById('comparisonResults');
        const selectedUniversities = this.selectedSchools.map(index => this.universities[index]);

        let tableHTML = `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Criteria</th>
                        ${selectedUniversities.map(uni => `<th>${uni.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Location</strong></td>
                        ${selectedUniversities.map(uni => `<td>${uni.location}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Tuition Fee</strong></td>
                        ${selectedUniversities.map(uni => `<td>€${uni.tuition_eur.toLocaleString()}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Duration</strong></td>
                        ${selectedUniversities.map(uni => `<td>${uni.duration_months} months</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Average Salary</strong></td>
                        ${selectedUniversities.map(uni => `<td>€${uni.avg_salary_eur.toLocaleString()}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>GMAT Requirement</strong></td>
                        ${selectedUniversities.map(uni => `<td>${uni.gmat_min}+</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Work Experience</strong></td>
                        ${selectedUniversities.map(uni => `<td>${uni.work_exp_years}+ years</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Application Fee</strong></td>
                        ${selectedUniversities.map(uni => `<td>€${uni.application_fee}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Global Ranking</strong></td>
                        ${selectedUniversities.map(uni => `<td>#${uni.ranking}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Accreditation</strong></td>
                        ${selectedUniversities.map(uni => `<td>${uni.accreditation.join(', ')}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>ROI (Salary/Tuition)</strong></td>
                        ${selectedUniversities.map(uni => `<td>${(uni.avg_salary_eur / uni.tuition_eur).toFixed(2)}x</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        `;

        resultsContainer.innerHTML = tableHTML;
    }

    setupCostCalculator() {
        console.log('Setting up cost calculator...');
        const universitySelect = document.getElementById('universitySelect');
        const durationInput = document.getElementById('durationInput');
        const budgetSlider = document.getElementById('budgetSlider');
        const budgetValue = document.getElementById('budgetValue');
        const resultsContainer = document.getElementById('calculatorResults');

        if (!universitySelect || !budgetSlider) {
            console.error('Calculator elements not found');
            return;
        }

        // Populate university dropdown
        this.universities.forEach((university, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = university.name;
            universitySelect.appendChild(option);
        });

        // Update budget display
        budgetSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            budgetValue.textContent = `€${value.toLocaleString()}`;
            
            // Update calculation if university is selected
            if (universitySelect.value !== '') {
                const selectedUniversity = this.universities[parseInt(universitySelect.value)];
                this.updateCostCalculation(selectedUniversity);
            }
        });

        // Handle university selection
        universitySelect.addEventListener('change', (e) => {
            if (e.target.value === '') {
                durationInput.value = '';
                resultsContainer.innerHTML = '<div class="cost-breakdown"><h3>Select a university to see cost breakdown</h3></div>';
                return;
            }

            const selectedUniversity = this.universities[parseInt(e.target.value)];
            durationInput.value = selectedUniversity.duration_months;
            this.updateCostCalculation(selectedUniversity);
        });
    }

    updateCostCalculation(university) {
        const monthlyBudget = parseInt(document.getElementById('budgetSlider').value);
        const duration = university.duration_months;
        
        const tuitionFee = university.tuition_eur;
        const livingExpenses = monthlyBudget * duration;
        const visaFee = 75;
        const applicationFee = university.application_fee;
        const totalCost = tuitionFee + livingExpenses + visaFee + applicationFee;

        const resultsContainer = document.getElementById('calculatorResults');
        resultsContainer.innerHTML = `
            <div class="cost-breakdown">
                <h3>${university.name} - Total Cost Breakdown</h3>
                <div class="cost-item">
                    <span>Tuition Fee</span>
                    <span>€${tuitionFee.toLocaleString()}</span>
                </div>
                <div class="cost-item">
                    <span>Living Expenses (${duration} months)</span>
                    <span>€${livingExpenses.toLocaleString()}</span>
                </div>
                <div class="cost-item">
                    <span>Visa Fee</span>
                    <span>€${visaFee}</span>
                </div>
                <div class="cost-item">
                    <span>Application Fee</span>
                    <span>€${applicationFee}</span>
                </div>
                <div class="cost-item">
                    <span><strong>Total Program Cost</strong></span>
                    <span><strong>€${totalCost.toLocaleString()}</strong></span>
                </div>
                <div style="margin-top: 20px; padding: 16px; background: var(--color-bg-3); border-radius: 8px;">
                    <p><strong>Expected ROI:</strong> With an average post-MBA salary of €${university.avg_salary_eur.toLocaleString()}, you could recover your investment in approximately ${Math.ceil(totalCost / (university.avg_salary_eur / 12))} months.</p>
                </div>
            </div>
        `;
    }

    setupEligibilityChecker() {
        console.log('Setting up eligibility checker...');
        const checkBtn = document.getElementById('checkEligibility');
        const resultsContainer = document.getElementById('eligibilityResults');

        if (!checkBtn) {
            console.error('Eligibility checker button not found');
            return;
        }

        checkBtn.addEventListener('click', () => {
            const workExp = parseInt(document.getElementById('workExp').value) || 0;
            const gmatScore = parseInt(document.getElementById('gmatScore').value) || 0;
            const education = document.getElementById('education').value;
            const english = document.getElementById('english').value;

            console.log('Checking eligibility:', { workExp, gmatScore, education, english });

            if (!education || !english || gmatScore === 0) {
                alert('Please fill in all fields');
                return;
            }

            this.checkEligibility(workExp, gmatScore, education, english);
        });
    }

    checkEligibility(workExp, gmatScore, education, english) {
        const eligibleSchools = [];
        const maybeSchools = [];
        const notEligibleSchools = [];

        this.universities.forEach(university => {
            const workExpMatch = workExp >= university.work_exp_years;
            const gmatMatch = gmatScore >= university.gmat_min;
            
            let score = 0;
            if (workExpMatch) score += 40;
            if (gmatMatch) score += 40;
            if (education === 'engineering' || education === 'business') score += 10;
            if (english === 'ielts7+' || english === 'native') score += 10;

            const schoolData = { ...university, score, workExpMatch, gmatMatch };

            if (score >= 80) {
                eligibleSchools.push(schoolData);
            } else if (score >= 60) {
                maybeSchools.push(schoolData);
            } else {
                notEligibleSchools.push(schoolData);
            }
        });

        this.displayEligibilityResults(eligibleSchools, maybeSchools, notEligibleSchools);
    }

    displayEligibilityResults(eligible, maybe, notEligible) {
        const resultsContainer = document.getElementById('eligibilityResults');
        
        let resultClass = 'success';
        let resultTitle = 'Great! You\'re eligible for multiple schools';
        
        if (eligible.length === 0 && maybe.length > 0) {
            resultClass = 'warning';
            resultTitle = 'You may be eligible with some improvements';
        } else if (eligible.length === 0 && maybe.length === 0) {
            resultClass = 'error';
            resultTitle = 'Consider strengthening your profile';
        }

        resultsContainer.className = `eligibility-results ${resultClass}`;
        
        let resultHTML = `<h3>${resultTitle}</h3>`;

        if (eligible.length > 0) {
            resultHTML += `
                <div class="school-recommendations">
                    <h4>✅ Highly Recommended Schools (${eligible.length})</h4>
                    <div class="school-list">
                        ${eligible.map(school => `
                            <div class="school-item">
                                <div>
                                    <strong>${school.name}</strong> - ${school.location}
                                    <br><small>Tuition: €${school.tuition_eur.toLocaleString()} | Avg Salary: €${school.avg_salary_eur.toLocaleString()}</small>
                                </div>
                                <span class="match-score high">${school.score}% Match</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (maybe.length > 0) {
            resultHTML += `
                <div class="school-recommendations">
                    <h4>⚠️ Consider These Schools (${maybe.length})</h4>
                    <div class="school-list">
                        ${maybe.map(school => `
                            <div class="school-item">
                                <div>
                                    <strong>${school.name}</strong> - ${school.location}
                                    <br><small>Tuition: €${school.tuition_eur.toLocaleString()} | Avg Salary: €${school.avg_salary_eur.toLocaleString()}</small>
                                </div>
                                <span class="match-score medium">${school.score}% Match</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Add recommendations
        resultHTML += `
            <div style="margin-top: 24px; padding: 20px; background: var(--color-bg-1); border-radius: 8px;">
                <h4>💡 Recommendations to Strengthen Your Profile:</h4>
                <ul style="margin: 12px 0; padding-left: 20px;">
                    <li>Consider retaking the GMAT for a higher score (target 650+)</li>
                    <li>Gain additional work experience in leadership roles</li>
                    <li>Build a strong application narrative highlighting your achievements</li>
                    <li>Consider professional MBA consultation for application strategy</li>
                </ul>
                <button class="btn btn--primary" onclick="window.open('https://crackverbal.com', '_blank')">Get Professional Help</button>
            </div>
        `;

        resultsContainer.innerHTML = resultHTML;
    }

    setupSalaryChart() {
        console.log('Setting up salary chart...');
        const canvas = document.getElementById('salaryChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.error('Chart canvas not found or Chart.js not loaded');
            return;
        }

        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.specializations.map(spec => spec.name),
                datasets: [{
                    label: 'Average Salary (€)',
                    data: this.specializations.map(spec => spec.avg_salary),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Post-MBA Salaries by Specialization in Germany',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString();
                            }
                        },
                        title: {
                            display: true,
                            text: 'Annual Salary (EUR)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'MBA Specialization'
                        }
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 4
                    }
                }
            }
        });
    }

    setupCTAButtons() {
        console.log('Setting up CTA buttons...');
        
        // Header CTA
        const expertConsultationBtn = document.getElementById('expertConsultation');
        if (expertConsultationBtn) {
            expertConsultationBtn.addEventListener('click', () => {
                console.log('Expert consultation clicked');
                this.showCTAModal('Expert MBA Consultation', 'Schedule a free consultation with our MBA experts to discuss your profile and application strategy.');
            });
        }

        // GMAT Prep CTA
        const gmatPrepBtn = document.getElementById('gmatPrep');
        if (gmatPrepBtn) {
            gmatPrepBtn.addEventListener('click', () => {
                console.log('GMAT prep clicked');
                this.showCTAModal('GMAT Preparation', 'Join our proven GMAT prep program and achieve your target score with personalized coaching.');
            });
        }

        // Profile Review CTA
        const profileReviewBtn = document.getElementById('profileReview');
        if (profileReviewBtn) {
            profileReviewBtn.addEventListener('click', () => {
                console.log('Profile review clicked');
                this.showCTAModal('Profile Review', 'Get a comprehensive review of your MBA profile and receive actionable feedback from experts.');
            });
        }

        // Timeline Help CTA
        const timelineHelpBtn = document.getElementById('timelineHelp');
        if (timelineHelpBtn) {
            timelineHelpBtn.addEventListener('click', () => {
                console.log('Timeline help clicked');
                this.showCTAModal('Application Support', 'Let our consultants guide you through the entire MBA application process and ensure you meet all deadlines.');
            });
        }

        // Career Guidance CTA
        const careerGuidanceBtn = document.getElementById('careerGuidance');
        if (careerGuidanceBtn) {
            careerGuidanceBtn.addEventListener('click', () => {
                console.log('Career guidance clicked');
                this.showCTAModal('Career Guidance', 'Discover the best MBA specialization for your career goals with personalized career counseling.');
            });
        }

        // Service CTAs
        const serviceButtons = document.querySelectorAll('[data-service]');
        console.log(`Found ${serviceButtons.length} service buttons`);
        serviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const service = e.target.getAttribute('data-service');
                console.log('Service button clicked:', service);
                const serviceNames = {
                    gmat: 'GMAT Preparation',
                    consulting: 'MBA Consulting',
                    profile: 'Profile Building',
                    interview: 'Interview Preparation'
                };
                this.showCTAModal(serviceNames[service], `Learn more about our ${serviceNames[service]} services and how we can help you succeed.`);
            });
        });
    }

    showCTAModal(title, message) {
        console.log('Showing CTA modal:', title);
        const response = confirm(`${title}\n\n${message}\n\nWould you like to visit Crackverbal's website to learn more?`);
        if (response) {
            window.open('https://crackverbal.com', '_blank');
        }
    }

    setupQuiz() {
        console.log('Setting up quiz...');
        
        // Add global functions for quiz navigation
        window.nextQuestion = () => {
            const currentQuestion = document.querySelector('.quiz-question.active');
            const nextQuestion = currentQuestion.nextElementSibling;
            
            if (nextQuestion && nextQuestion.classList.contains('quiz-question')) {
                currentQuestion.classList.remove('active');
                nextQuestion.classList.add('active');
                this.currentQuizQuestion++;
                this.updateQuizProgress();
            } else {
                this.showQuizResults();
            }
        };

        window.previousQuestion = () => {
            const currentQuestion = document.querySelector('.quiz-question.active');
            const prevQuestion = currentQuestion.previousElementSibling;
            
            if (prevQuestion && prevQuestion.classList.contains('quiz-question')) {
                currentQuestion.classList.remove('active');
                prevQuestion.classList.add('active');
                this.currentQuizQuestion--;
                this.updateQuizProgress();
            }
        };

        window.scrollToSection = (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        };

        this.updateQuizProgress();
    }

    updateQuizProgress() {
        const progressBar = document.querySelector('.quiz-progress-bar');
        if (progressBar) {
            const progress = (this.currentQuizQuestion / this.totalQuizQuestions) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    showQuizResults() {
        // Hide all questions
        document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
        
        // Show results
        const resultDiv = document.getElementById('quiz-result');
        if (resultDiv) {
            resultDiv.style.display = 'block';
            
            // Calculate score based on answers
            let score = 0;
            const questions = document.querySelectorAll('.quiz-question');
            
            questions.forEach(question => {
                const selectedAnswer = question.querySelector('input:checked');
                if (selectedAnswer) {
                    // Simple scoring logic - you can make this more sophisticated
                    score += 20;
                }
            });

            document.getElementById('score-value').textContent = score;
            
            let interpretation = '';
            if (score >= 80) {
                interpretation = 'Excellent! You\'re well-prepared for MBA applications in Germany.';
            } else if (score >= 60) {
                interpretation = 'Good preparation! Consider strengthening a few areas.';
            } else {
                interpretation = 'Consider working on your profile before applying.';
            }
            
            document.getElementById('score-interpretation').textContent = interpretation;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    new MBAGermanyApp();
});