document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(faqItem => {
                if (faqItem !== item) {
                    faqItem.classList.remove('active');
                    const otherAnswer = faqItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0';
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
            
            // Update max-height for smooth animation
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
        
        // Set initial state
        answer.style.maxHeight = '0';
    });


    // Lead Form Submission with validation
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = leadForm.querySelectorAll('input');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                alert('Obrigado! Entraremos em contato em breve.');
                leadForm.reset();
            } else {
                alert('Por favor, preencha todos os campos corretamente.');
            }
        });
    }

    // Countdown Timer
    function updateTimer() {
        const now = new Date();
        const hours = document.getElementById('hours');
        const minutes = document.getElementById('minutes');
        const seconds = document.getElementById('seconds');
        
        if (hours && minutes && seconds) {
            const endTime = new Date();
            endTime.setHours(23, 59, 59, 999);
            
            if (now >= endTime) {
                endTime.setDate(endTime.getDate() + 1);
            }
            
            let diff = Math.max(0, Math.floor((endTime - now) / 1000));
            
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            
            hours.textContent = String(h).padStart(2, '0');
            minutes.textContent = String(m).padStart(2, '0');
            seconds.textContent = String(s).padStart(2, '0');
        }
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // Testimonials Carousel
    const carousel = document.getElementById('testimonialCarousel');
    const beforeAfterContainer = carousel.querySelector('.before-after-container');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    // Define a largura de cada item do carrossel (imagem + gap)
    const itemWidth = 270; // 250px (largura da imagem) + 20px (gap)
    let currentIndex = 0;
    
    // Total de imagens no carrossel
    const totalImages = beforeAfterContainer.querySelectorAll('.before-after-image').length;
    
    // Função para atualizar a posição do carrossel
    function updateCarousel() {
        beforeAfterContainer.style.transition = 'transform 0.5s ease';
        beforeAfterContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
    
    // Função para ir para o próximo slide
    function nextSlide() {
        if (currentIndex < totalImages - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }
    
    // Função para ir para o slide anterior
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalImages - 1;
        }
        updateCarousel();
    }
    
    // Adicionar eventos aos botões
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
    }
    
    // Auto-rotação do carrossel
    let autoRotate = setInterval(nextSlide, 5000);
    
    // Pausar a rotação automática quando o mouse estiver sobre o carrossel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });
    
    // Retomar a rotação automática quando o mouse sair do carrossel
    carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextSlide, 5000);
    });
    
    // Suporte para gestos de deslize em dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoRotate);
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        autoRotate = setInterval(nextSlide, 5000);
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
        }
    }
});
