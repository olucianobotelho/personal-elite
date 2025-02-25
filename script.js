document.addEventListener('DOMContentLoaded', () => {
    // Credential Numbers Animation
    const credentials = document.querySelectorAll('.credential-number');
    let hasAnimated = false;

    function animateNumbers() {
        credentials.forEach(credential => {
            const target = parseInt(credential.textContent);
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    credential.textContent = target + (credential.textContent.includes('+') ? '+' : '');
                    clearInterval(counter);
                } else {
                    credential.textContent = Math.round(current) + (credential.textContent.includes('+') ? '+' : '');
                }
            }, stepTime);
        });
        hasAnimated = true;
    }

    // Intersection Observer for credential numbers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateNumbers();
            }
        });
    }, { threshold: 0.5 });

    credentials.forEach(credential => observer.observe(credential));
});

