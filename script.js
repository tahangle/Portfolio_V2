document.addEventListener('DOMContentLoaded', function() {
    // About link and logo click handlers
    const intro = document.querySelector('.intro');
    const infoColumns = document.querySelector('.info-columns');
    const aboutLink = document.getElementById('aboutLink');
    const logo = document.getElementById('logo');

    let isAboutVisible = false;

    if (aboutLink && intro && infoColumns) {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();

            if (!isAboutVisible) {
                // Fade in about content
                gsap.to(intro, {
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    delay: 0.1
                });

                gsap.to(infoColumns, {
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    delay: 0.3
                });

                // Add active class
                aboutLink.classList.add('active');
                isAboutVisible = true;
            }
        });
    }

    if (logo && intro && infoColumns) {
        logo.addEventListener('click', function() {
            if (isAboutVisible) {
                // Fade out about content
                gsap.to(intro, {
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.in'
                });

                gsap.to(infoColumns, {
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.in'
                });

                // Remove active class
                aboutLink.classList.remove('active');
                isAboutVisible = false;
            }
        });
    }

    // Mobile menu toggle with GSAP animation
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    let isMenuOpen = false;

    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            // Set initial state for mobile
            gsap.set(nav, {
                height: 0,
                opacity: 0,
                display: 'flex'
            });
        } else {
            // Reset for desktop
            gsap.set(nav, {
                height: 'auto',
                opacity: 1,
                display: 'flex'
            });
        }
    }

    if (menuToggle) {
        initMobileMenu();

        menuToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                if (!isMenuOpen) {
                    // Open menu
                    menuToggle.textContent = '[-]';
                    gsap.to(nav, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                    isMenuOpen = true;
                } else {
                    // Close menu
                    menuToggle.textContent = '[+]';
                    gsap.to(nav, {
                        height: 0,
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.in'
                    });
                    isMenuOpen = false;
                }
            }
        });

        // Reset on window resize
        window.addEventListener('resize', function() {
            initMobileMenu();
            if (window.innerWidth > 768) {
                isMenuOpen = false;
                menuToggle.textContent = '[+]';
            }
        });
    }

    // Project Gallery Navigation
    const projectGallery = document.getElementById('projectGallery');
    const galleryCursor = document.getElementById('galleryCursor');

    if (projectGallery && galleryCursor) {
        const slides = projectGallery.querySelectorAll('.gallery-slide');
        let currentSlide = 0;
        const totalSlides = slides.length;

        // Update cursor text
        function updateCursor() {
            galleryCursor.textContent = `${currentSlide + 1}/${totalSlides}`;
        }

        // Navigate to next slide
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
            updateCursor();
        }

        // Navigate to previous slide
        function prevSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            slides[currentSlide].classList.add('active');
            updateCursor();
        }

        // Mouse position tracking
        projectGallery.addEventListener('mousemove', function(e) {
            galleryCursor.style.left = e.clientX + 15 + 'px';
            galleryCursor.style.top = e.clientY + 15 + 'px';
        });

        // Click to navigate
        projectGallery.addEventListener('click', function(e) {
            const rect = projectGallery.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const galleryWidth = rect.width;

            if (clickX > galleryWidth / 2) {
                nextSlide();
            } else {
                prevSlide();
            }
        });

        // Touch/swipe navigation for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        projectGallery.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        projectGallery.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - go to next slide
                    nextSlide();
                } else {
                    // Swiped right - go to previous slide
                    prevSlide();
                }
            }
        }

        // Initialize cursor
        updateCursor();
    }
});
