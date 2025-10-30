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

        // Mobile auto-play animation
        if (isMobile) {
            let autoPlayInterval;
            let pathIndex = 0;
            let currentPath = [];
            const mobileMovementThreshold = 2000; // Faster text reveal on mobile

            // Generate elegant smooth path that avoids center
            function generatePath() {
                const path = [];
                const numPoints = 80;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const avoidRadius = 150; // Keep clear of center

                // Start from a random edge
                const startSide = Math.floor(Math.random() * 4);
                let startX, startY;

                switch(startSide) {
                    case 0: startX = Math.random() * window.innerWidth; startY = 80; break;
                    case 1: startX = window.innerWidth - 80; startY = Math.random() * window.innerHeight; break;
                    case 2: startX = Math.random() * window.innerWidth; startY = window.innerHeight - 80; break;
                    case 3: startX = 80; startY = Math.random() * window.innerHeight; break;
                }

                let currentX = startX;
                let currentY = startY;
                let angle = Math.random() * Math.PI * 2;

                for (let i = 0; i < numPoints; i++) {
                    // Smooth curved motion
                    angle += (Math.random() - 0.5) * 0.3;
                    const distance = 15 + Math.random() * 20;

                    currentX += Math.cos(angle) * distance;
                    currentY += Math.sin(angle) * distance;

                    // Keep within bounds with padding
                    currentX = Math.max(80, Math.min(window.innerWidth - 80, currentX));
                    currentY = Math.max(80, Math.min(window.innerHeight - 80, currentY));

                    // Avoid center area
                    const distToCenter = Math.sqrt(Math.pow(currentX - centerX, 2) + Math.pow(currentY - centerY, 2));
                    if (distToCenter < avoidRadius) {
                        const angleFromCenter = Math.atan2(currentY - centerY, currentX - centerX);
                        currentX = centerX + Math.cos(angleFromCenter) * avoidRadius;
                        currentY = centerY + Math.sin(angleFromCenter) * avoidRadius;
                        angle = angleFromCenter + Math.PI / 2; // Curve around center
                    }

                    path.push({ x: currentX, y: currentY });
                }
                return path;
            }

            currentPath = generatePath();

            // Slower interval for mobile - more elegant
            autoPlayInterval = setInterval(function() {
                if (pathIndex >= currentPath.length) {
                    currentPath = generatePath();
                    pathIndex = 0;
                }

                const point = currentPath[pathIndex];
                createImageAt(point.x, point.y);

                // Track movement for text reveal (faster on mobile)
                if (lastX !== 0 && lastY !== 0) {
                    const dx = point.x - lastX;
                    const dy = point.y - lastY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    totalMovement += distance;

                    if (!hasShownText && totalMovement >= mobileMovementThreshold) {
                        gsap.to(centerText, {
                            opacity: 1,
                            duration: 2,
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
                        }, 2000); // Shorter wait on mobile
                    }
                }
                lastX = point.x;
                lastY = point.y;

                pathIndex++;
            }, 120); // Slower - double the separation time for more elegant feel
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

        // Click to go to Projects page
        aboutPage.addEventListener('click', function() {
            window.location.href = 'projects.html';
        });
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
