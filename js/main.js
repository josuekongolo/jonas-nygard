/* ===================================
   JONAS NYGÅRD - Main JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initContactForm();
    initAnimations();
});

/* ===================================
   Mobile Menu
   =================================== */

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
    const body = document.body;

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('menu-toggle--active');
        mobileNav.classList.toggle('mobile-nav--active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('menu-toggle--active');
            mobileNav.classList.remove('mobile-nav--active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--active')) {
            menuToggle.classList.remove('menu-toggle--active');
            mobileNav.classList.remove('mobile-nav--active');
            body.classList.remove('menu-open');
        }
    });
}

/* ===================================
   Sticky Header
   =================================== */

function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled past threshold
        if (currentScroll > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ===================================
   Smooth Scroll
   =================================== */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or if the target doesn't exist
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ===================================
   Contact Form
   =================================== */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMessage = document.querySelector('.form-message--success');
    const errorMessage = document.querySelector('.form-message--error');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset messages
        if (successMessage) successMessage.classList.remove('show');
        if (errorMessage) errorMessage.classList.remove('show');

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address') || '',
            jobType: formData.get('jobType'),
            description: formData.get('description'),
            wantSiteVisit: formData.get('siteVisit') === 'on'
        };

        // Validate required fields
        if (!data.name || !data.email || !data.phone || !data.description) {
            if (errorMessage) {
                errorMessage.textContent = 'Ver venleg og fyll ut alle obligatoriske felt.';
                errorMessage.classList.add('show');
            }
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            if (errorMessage) {
                errorMessage.textContent = 'Ver venleg og skriv inn ei gyldig e-postadresse.';
                errorMessage.classList.add('show');
            }
            return;
        }

        // Disable submit button and show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sender...';
        }

        try {
            // For demo purposes, simulate form submission
            // In production, replace with actual Resend API call
            await simulateFormSubmission(data);

            // Show success message
            if (successMessage) {
                successMessage.classList.add('show');
            }

            // Reset form
            form.reset();

            // Scroll to success message
            successMessage?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Form submission error:', error);
            if (errorMessage) {
                errorMessage.textContent = 'Noko gjekk gale. Prøv igjen eller ring oss direkte.';
                errorMessage.classList.add('show');
            }
        } finally {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Melding';
            }
        }
    });
}

// Simulate form submission (replace with actual API call in production)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        console.log('Form data submitted:', data);

        // Simulate network delay
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve({ success: true });
            } else {
                reject(new Error('Simulated error'));
            }
        }, 1500);
    });
}

// Actual Resend API call (uncomment and configure for production)
/*
async function sendFormWithResend(data) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_RESEND_API_KEY'
        },
        body: JSON.stringify({
            from: 'nettside@jonasnygard.no',
            to: 'post@jonasnygard.no',
            subject: `Ny henvendelse fra ${data.name}`,
            html: `
                <h2>Ny henvendelse fra nettsiden</h2>
                <p><strong>Namn:</strong> ${data.name}</p>
                <p><strong>E-post:</strong> ${data.email}</p>
                <p><strong>Telefon:</strong> ${data.phone}</p>
                <p><strong>Adresse:</strong> ${data.address || 'Ikkje oppgitt'}</p>
                <p><strong>Type jobb:</strong> ${data.jobType}</p>
                <p><strong>Ønskjer befaring:</strong> ${data.wantSiteVisit ? 'Ja' : 'Nei'}</p>
                <h3>Beskriving av jobben:</h3>
                <p>${data.description}</p>
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
}
*/

/* ===================================
   Scroll Animations
   =================================== */

function initAnimations() {
    // Only run animations if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll('.service-card, .why-card, .value-card, .project-card, .service-detail');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
}

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    body.menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(animationStyles);

/* ===================================
   Phone Number Click Tracking
   =================================== */

document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone clicks (integrate with analytics if needed)
        console.log('Phone number clicked:', this.href);
    });
});

/* ===================================
   Current Page Active State
   =================================== */

function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Check if it's the current page
        if (currentPath.endsWith(href) ||
            (currentPath.endsWith('/') && href === 'index.html') ||
            (currentPath.includes(href.replace('.html', '')))) {
            link.classList.add('nav__link--active', 'mobile-nav__link--active');
        }
    });
}

setActiveNavLink();
