document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    function updateIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
                updateIcon(newTheme);
            });
        
            // --- Custom Cursor Logic ---
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                document.addEventListener('mousemove', e => {
                    cursor.setAttribute("style", "top: " + (e.clientY) + "px; left: " + (e.clientX) + "px;");
                });
        
                document.querySelectorAll('a, button, .project-header, .card').forEach(element => {
                    element.addEventListener('mouseenter', () => {
                        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    });
                    element.addEventListener('mouseleave', () => {
                        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                    });
                });
            }
        
            // --- Unfoldable Projects Logic ---
    const projectHeaders = document.querySelectorAll('.project-header');
    projectHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('open');
        });
    });

    // --- Advanced Typing Effect Logic ---
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const phrases = ["Professional Cloud Juggler", "Freelance DevOps Engineer"];
        let phraseIndex = 0;
        let letterIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            let text = currentPhrase.substring(0, letterIndex);

            typingElement.textContent = text;

            if (isDeleting) {
                letterIndex--;
            } else {
                letterIndex++;
            }

            let charSpeed = isDeleting ? 100 : 180;

            if (!isDeleting && letterIndex > currentPhrase.length) {
                charSpeed = 1000;
                isDeleting = true;
                setTimeout(type, charSpeed);
                return;
            } else if (isDeleting && letterIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                charSpeed = 1000;
                setTimeout(type, charSpeed);
                return;
            }

            setTimeout(type, charSpeed);
        }
        type();
    }

    // --- Card Deck Logic (Corrected for 6 cards) ---
    const cardStack = document.querySelector('.card-stack');
    if (cardStack) {
        let cards = Array.from(cardStack.querySelectorAll('.card'));
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');

        function updateCards() {
            cards.forEach((card, index) => {
                const isActive = index === 0;
                card.classList.toggle('is-active', isActive);

                if (isActive) {
                    card.style.transform = 'translate(0, -10px) scale(1.05)';
                    card.style.zIndex = 6;
                    card.style.opacity = 1;
                } else {
                    let offset = index * 20;
                    let rotate = index * 4;
                    card.style.transform = `translateX(${offset}px) rotate(${rotate}deg) scale(${1 - (index * 0.05)})`;
                    card.style.zIndex = cards.length - index;
                    card.style.opacity = 1 - (index * 0.2);
                }
            });
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                cards.push(cards.shift()); // Move the first card to the end
                updateCards();
            });

            prevBtn.addEventListener('click', () => {
                cards.unshift(cards.pop()); // Move the last card to the beginning
                updateCards();
            });
        }

        // Initial setup
        updateCards();

        // Add click listener to cards to allow navigation
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const cardIndex = cards.indexOf(card);
                if (cardIndex !== 0) {
                    // It's not the active card, so move it to the front
                    cards.splice(cardIndex, 1); // remove it
                    cards.unshift(card); // add it to the front
                    updateCards();
                }
            });
        });
    }

    // --- Animated Stats Banner Logic ---
    const statsSection = document.querySelector('.stats-banner');
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(number => {
                    const target = +number.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const stepTime = 50;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            let finalValue = '+' + target;
                            number.textContent = finalValue;
                        } else {
                            number.textContent = Math.ceil(current);
                        }
                    }, stepTime);
                });
                observer.unobserve(statsSection); // Animate only once
            }
        });
    };

    if (statsSection) {
        const observer = new IntersectionObserver(animateStats, { threshold: 0.5 });
        observer.observe(statsSection);
    }
});