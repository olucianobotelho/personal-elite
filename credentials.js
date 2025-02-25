// Credentials Animation
document.addEventListener('DOMContentLoaded', () => {
    const credentialNumbers = document.querySelectorAll('.credential-number');
    const finalValues = [
        { value: 10, suffix: '+' },
        { value: 500, suffix: '+' },
        { value: 5, suffix: '' }
    ];

    const animateNumber = (element, finalValue, suffix) => {
        let current = 0;
        const increment = finalValue / 50; // Divide animation into 50 steps
        const duration = 2000; // 2 seconds duration
        const interval = duration / 50;

        const counter = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(counter);
            }
            element.textContent = Math.floor(current) + suffix;
        }, interval);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const credentials = document.querySelector('.credentials');
                if (credentials) {
                    credentialNumbers.forEach((number, index) => {
                        animateNumber(number, finalValues[index].value, finalValues[index].suffix);
                    });
                }
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    const credentials = document.querySelector('.credentials');
    if (credentials) {
        observer.observe(credentials);
    }
});