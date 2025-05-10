<<<<<<< HEAD
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    // Add mobile menu toggle functionality
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.classList.add('mobile-menu-button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.setAttribute('aria-label', 'Toggle navigation menu');

    const nav = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');

    if (nav && navLinks) {
        nav.insertBefore(mobileMenuButton, navLinks);

        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuButton.setAttribute('aria-expanded',
                navLinks.classList.contains('active'));
        });
    }

    // Newsletter form handling
=======
// Newsletter form handling
document.addEventListener('DOMContentLoaded', () => {
>>>>>>> Master_R
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            // TODO: Implement newsletter subscription logic
            alert('Thank you for subscribing! We\'ll keep you updated with the latest AI news.');
            newsletterForm.reset();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add scroll-based header styling
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}); 