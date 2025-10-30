document.addEventListener('DOMContentLoaded', function() {
    // ==== HOMEPAGE ====
    const homepage = document.querySelector('.homepage');
    if (homepage) {
        const cursorTrail = document.getElementById('cursor-trail');

        // Array of gallery images
        const galleryImages = [
            'Images/Gallery/Group 12.png',
            'Images/Gallery/Group 13.png',
            'Images/Gallery/Group 14.png',
            'Images/Gallery/Group 15.png',
            'Images/Gallery/Group 16.png',
            'Images/Gallery/Group 17.png',
            'Images/Gallery/Group 18.png',
            'Images/Gallery/Group 19.png',
            'Images/Gallery/Group 20.png',
            'Images/Gallery/Group 21.png',
            'Images/Gallery/Group 22.png',
            'Images/Gallery/Group 23.png',
            'Images/Gallery/Group 24.png',
            'Images/Gallery/Group 25.png',
            'Images/Gallery/Group 26.png',
            'Images/Gallery/Group 27.png',
            'Images/Gallery/Group 28.png',
            'Images/Gallery/Group 29.png',
            'Images/Gallery/Group 30.png',
            'Images/Gallery/Group 31.png',
            'Images/Gallery/Group 32.png',
            'Images/Gallery/Group 33.png',
            'Images/Gallery/Group 34.png',
            'Images/Gallery/Group 35.png',
            'Images/Gallery/Group 36.png',
            'Images/Gallery/Group 38.png',
            'Images/Gallery/Group 39.png',
            'Images/Gallery/Group 40.png',
            'Images/Gallery/Group 41.png',
            'Images/Gallery/Group 42.png',
            'Images/Gallery/Group 43.png',
            'Images/Gallery/Group 47.png'
        ];

        let currentImageIndex = 0;
        let lastImageTime = 0;
        const separationTime = 60;

        // Track cursor movement for center text reveal
        let totalMovement = 0;
        let lastX = 0;
        let lastY = 0;
        let hasShownText = false;
        const movementThreshold = 5000; // pixels of movement
        const centerText = document.getElementById('centerText');

        // Check if device is mobile/touch
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

        // Function to create image at specific position
        function createImageAt(x, y) {
            const img = document.createElement('img');
            img.src = galleryImages[currentImageIndex];
            img.className = 'cursor-image';
            img.style.left = (x - 50) + 'px';
            img.style.top = (y - 50) + 'px';
            img.style.opacity = '1';

            cursorTrail.appendChild(img);

            setTimeout(function() {
                img.style.opacity = '0';
                setTimeout(function() {
                    img.remove();
                }, 1000);
            }, 500);

            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        }

        // Mobile touch drawing interaction
        if (isMobile) {
            let isTouching = false;
            let touchReleased = false;
            const mobileMovementThreshold = 800; // Minimum drawing before text appears

            homepage.addEventListener('touchstart', function(e) {
                isTouching = true;
                const touch = e.touches[0];
                lastX = touch.clientX;
                lastY = touch.clientY;
            }, { passive: true });

            homepage.addEventListener('touchmove', function(e) {
                if (!isTouching) return;

                const touch = e.touches[0];
                const currentTime = Date.now();

                // Track movement distance
                if (lastX !== 0 && lastY !== 0) {
                    const dx = touch.clientX - lastX;
                    const dy = touch.clientY - lastY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    totalMovement += distance;
                }

                // Create image trail while drawing
                if (currentTime - lastImageTime >= separationTime) {
                    createImageAt(touch.clientX, touch.clientY);
                    lastImageTime = currentTime;
                }

                lastX = touch.clientX;
                lastY = touch.clientY;
            }, { passive: true });

            homepage.addEventListener('touchend', function(e) {
                isTouching = false;

                // Show text when user releases touch (if they drew enough)
                if (!hasShownText && !touchReleased && totalMovement >= mobileMovementThreshold) {
                    touchReleased = true;

                    // Small delay to let last images appear
                    setTimeout(function() {
                        gsap.to(centerText, {
                            opacity: 1,
                            duration: 1.5,
                            ease: 'power2.out'
                        });
                        hasShownText = true;

                        setTimeout(function() {
                            gsap.to(centerText, {
                                opacity: 0,
                                duration: 0.5,
                                ease: 'power2.out',
                                onComplete: function() {
                                    centerText.innerHTML = '<span class="bold-text">click</span> to know more';
                                    gsap.to(centerText, {
                                        opacity: 1,
                                        duration: 1,
                                        ease: 'power2.out'
                                    });
                                }
                            });
                        }, 1500);
                    }, 300);
                }
            }, { passive: true });
        }

        // Cursor trail animation for desktop
        if (!isMobile) {
            homepage.addEventListener('mousemove', function(e) {
                const currentTime = Date.now();

                // Track total cursor movement
                if (lastX !== 0 && lastY !== 0) {
                    const dx = e.clientX - lastX;
                    const dy = e.clientY - lastY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    totalMovement += distance;

                    // Show center text after threshold
                    if (!hasShownText && totalMovement >= movementThreshold) {
                        gsap.to(centerText, {
                            opacity: 1,
                            duration: 2,
                            ease: 'power2.out'
                        });
                        hasShownText = true;

                        // Change text after 3 seconds
                        setTimeout(function() {
                            gsap.to(centerText, {
                                opacity: 0,
                                duration: 0.5,
                                ease: 'power2.out',
                                onComplete: function() {
                                    centerText.innerHTML = '<span class="bold-text">click</span> to know more';
                                    gsap.to(centerText, {
                                        opacity: 1,
                                        duration: 1,
                                        ease: 'power2.out'
                                    });
                                }
                            });
                        }, 3000);
                    }
                }
                lastX = e.clientX;
                lastY = e.clientY;

                if (currentTime - lastImageTime >= separationTime) {
                    createImageAt(e.clientX, e.clientY);
                    lastImageTime = currentTime;
                }
            });
        }

        // Click to go to About page
        homepage.addEventListener('click', function() {
            // On mobile, only allow click after text has appeared
            if (isMobile && !hasShownText) {
                return;
            }
            window.location.href = 'about.html';
        });
    }

    // ==== ABOUT PAGE ====
    const aboutPage = document.querySelector('.about-page');
    if (aboutPage) {
        const intro = aboutPage.querySelector('.intro');
        const infoColumns = aboutPage.querySelector('.info-columns');

        // Fade in animations
        if (intro) {
            gsap.to(intro, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.1
            });
        }

        if (infoColumns) {
            gsap.to(infoColumns, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.3
            });
        }

        // Click to go to Projects page (desktop only)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        if (!isMobile) {
            aboutPage.addEventListener('click', function() {
                window.location.href = 'projects.html';
            });
        }
    }

    // ==== PROJECTS PAGE ====
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        gsap.to(projectsGrid, {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.2
        });
    }

    // ==== PROJECT DETAIL GALLERY ====
    const projectGallery = document.getElementById('projectGallery');
    const galleryCursor = document.getElementById('galleryCursor');

    if (projectGallery && galleryCursor) {
        const slides = projectGallery.querySelectorAll('.gallery-slide');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateCursor() {
            galleryCursor.textContent = `${currentSlide + 1}/${totalSlides}`;
        }

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
            updateCursor();
        }

        function prevSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            slides[currentSlide].classList.add('active');
            updateCursor();
        }

        projectGallery.addEventListener('mousemove', function(e) {
            galleryCursor.style.left = e.clientX + 15 + 'px';
            galleryCursor.style.top = e.clientY + 15 + 'px';
        });

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
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        updateCursor();
    }

    // ==== MOBILE MENU ====
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    let isMenuOpen = false;

    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            gsap.set(nav, {
                height: 0,
                opacity: 0,
                display: 'flex'
            });
        } else {
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
                    menuToggle.textContent = '[-]';
                    gsap.to(nav, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                    isMenuOpen = true;
                } else {
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

        window.addEventListener('resize', function() {
            initMobileMenu();
            if (window.innerWidth > 768) {
                isMenuOpen = false;
                menuToggle.textContent = '[+]';
            }
        });
    }
});
