/**
 * Navigation & Mobile Menu Handler
 * Manages responsive navigation for AQIMap.fun
 */

document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileToggle) mobileToggle.textContent = '☰';
        }
    });

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileToggle) mobileToggle.textContent = '☰';
            }
        });
    });
});
