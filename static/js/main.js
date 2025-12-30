// ========================================
// AI RESUME SKILL GAP ANALYZER
// Interactive JavaScript Effects
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initFileUpload();
    initFormSubmit();
    initAnimations();
    initNavbar();
    initFAQ();
    initCountUp();
    initSmoothScroll();
    initTypingEffect();
});

// ========================================
// NAVIGATION
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ========================================
// COUNT UP ANIMATION
// ========================================
function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// TYPING EFFECT
// ========================================
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const words = ['Skill Gaps', 'Career Path', 'Next Steps', 'Dream Job'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isWaiting) {
            setTimeout(type, 50);
            return;
        }

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            isWaiting = true;
            setTimeout(() => {
                isWaiting = false;
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing after a delay
    setTimeout(type, 1000);
}

// ========================================
// FLOATING PARTICLES EFFECT
// ========================================
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    const colors = [
        'rgba(139, 92, 246, 0.6)',   // Purple
        'rgba(6, 182, 212, 0.6)',     // Cyan
        'rgba(244, 114, 182, 0.6)',   // Pink
        'rgba(16, 185, 129, 0.5)',    // Green
        'rgba(245, 158, 11, 0.5)'     // Orange
    ];

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }

    // Create initial particles
    for (let i = 0; i < 30; i++) {
        setTimeout(createParticle, i * 200);
    }

    // Continuously create new particles
    setInterval(createParticle, 800);
}

// ========================================
// FILE UPLOAD HANDLING
// ========================================
function initFileUpload() {
    const fileUpload = document.querySelector('.file-upload');
    const fileInput = document.getElementById('resume_file');
    const fileName = document.querySelector('.file-name');

    if (!fileUpload || !fileInput) return;

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUpload.addEventListener(eventName, (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileUpload.addEventListener(eventName, (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
        });
    });

    fileUpload.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateFileName(files[0].name);
        }
    });

    // File input change
    fileInput.addEventListener('change', function () {
        if (this.files.length > 0) {
            updateFileName(this.files[0].name);
        }
    });

    function updateFileName(name) {
        if (fileName) {
            fileName.textContent = '📄 ' + name;
            fileName.style.display = 'block';
        }
    }
}

// ========================================
// FORM SUBMISSION
// ========================================
function initFormSubmit() {
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('.btn-primary[type="submit"]');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', function (e) {
        const resumeFile = document.getElementById('resume_file');
        const resumeText = document.getElementById('resume_text');
        const jobDescription = document.getElementById('job_description');

        // Validate input
        const hasFile = resumeFile && resumeFile.files.length > 0;
        const hasText = resumeText && resumeText.value.trim();
        const hasJob = jobDescription && jobDescription.value.trim();

        if (!hasFile && !hasText) {
            e.preventDefault();
            showError('Please upload a resume file or paste your resume text');
            return;
        }

        if (!hasJob) {
            e.preventDefault();
            showError('Please enter a job description');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span class="btn-text">Analyzing...</span>';
    });

    function showError(message) {
        // Remove existing error
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Create error element
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = `<span>⚠️</span> ${message}`;

        // Insert at top of form
        form.insertBefore(error, form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            error.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => error.remove(), 300);
        }, 5000);
    }
}

// ========================================
// ANIMATIONS
// ========================================
function initAnimations() {
    // Animate skill tags with stagger
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.05}s`;
    });

    // Animate recommendation cards with stagger
    const recCards = document.querySelectorAll('.recommendation-card');
    recCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-card, .card, .step-card, .feature-card, .testimonial-card, .faq-item').forEach(el => {
        observer.observe(el);
    });

    // Initialize match circle animation
    initMatchCircle();
}

// ========================================
// MATCH PERCENTAGE CIRCLE
// ========================================
function initMatchCircle() {
    const matchCircle = document.querySelector('.match-circle');
    if (!matchCircle) return;

    const percentage = parseInt(matchCircle.dataset.percentage) || 0;
    const circumference = 565.48; // 2 * PI * 90 (radius)
    const progress = circumference - (percentage / 100) * circumference;

    matchCircle.style.setProperty('--progress', progress);

    // Add class based on percentage
    if (percentage >= 70) {
        matchCircle.classList.add('excellent');
    } else if (percentage >= 40) {
        matchCircle.classList.add('good');
    } else {
        matchCircle.classList.add('needs-work');
    }

    // Animate percentage number
    const percentageEl = matchCircle.querySelector('.percentage');
    if (percentageEl) {
        animateNumber(percentageEl, 0, percentage, 2000);
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);

        element.textContent = current + '%';

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// UTILITY ANIMATIONS
// ========================================

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    .visible {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Add smooth reveal for page load
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});
