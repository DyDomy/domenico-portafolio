// Loading Screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 3000);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Active Nav Link on Scroll
const pageSections = document.querySelectorAll('section[id]');
const pageNavLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    pageSections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            pageNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Fade-in animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project items and work cards
document.querySelectorAll('.project-item, .work-card, .service-box').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
    fadeObserver.observe(el);
});

// Removed buggy parallax effect

// Simple cursor dot (no trail to avoid bugs)
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorDot.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursorDot);

let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.opacity = '0.6';
});

function animateCursor() {
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    
    cursorDot.style.left = dotX - 4 + 'px';
    cursorDot.style.top = dotY - 4 + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Removed typing effect to avoid bugs

// Removed skill tag animation to avoid bugs
