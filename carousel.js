document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos
    const container = document.querySelector('.before-after-container');
    const pairs = document.querySelectorAll('.before-after-pair');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    // Verificação de elementos
    if (!container || pairs.length === 0) {
        console.error('Elementos necessários não encontrados');
        return;
    }
    
    // Criar slides individuais
    const slides = [];
    pairs.forEach(pair => {
        const images = pair.querySelectorAll('.before-after-image');
        images.forEach(img => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.appendChild(img.cloneNode(true));
            container.appendChild(slide);
            slides.push(slide);
        });
        pair.remove();
    });
    
    // Configurações do carrossel
    let currentIndex = 0;
    let autoPlayInterval;
    const slideCount = slides.length;
    const visibleSlides = Math.min(5, slideCount); // Número de slides visíveis (ajustável)
    
    // Configurar estilos do container
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.position = 'relative';
    container.style.perspective = '1000px';
    container.style.width = '100%';
    container.style.height = '400px'; // Ajuste conforme necessário
    
    // Configurar estilos iniciais dos slides
    slides.forEach(slide => {
        slide.style.position = 'absolute';
        slide.style.width = '60%'; // Tamanho do slide central
        slide.style.height = 'auto';
        slide.style.transition = 'all 0.5s ease-in-out';
        slide.style.display = 'flex';
        slide.style.justifyContent = 'center';
        slide.style.alignItems = 'center';
        slide.style.backfaceVisibility = 'hidden';
    });
    
    // Função para atualizar o carrossel
    function updateCarousel() {
        slides.forEach((slide, index) => {
            // Calcular a posição relativa ao slide atual
            let offset = index - currentIndex;
            
            // Ajuste para navegação circular
            if (offset > slideCount / 2) offset -= slideCount;
            if (offset < -slideCount / 2) offset += slideCount;
            
            // Aplicar transformações 3D
            if (Math.abs(offset) > Math.floor(visibleSlides / 2)) {
                // Ocultar slides fora da visualização
                slide.style.opacity = '0';
                slide.style.zIndex = '0';
                slide.style.pointerEvents = 'none';
            } else {
                // Configurar posição, escala e opacidade com base na distância do centro
                const xPosition = offset * 70; // Distância horizontal
                const zPosition = Math.abs(offset) * -100; // Profundidade
                const scale = 1 - Math.abs(offset) * 0.2; // Escala
                const opacity = 1 - Math.abs(offset) * 0.3; // Opacidade
                
                slide.style.transform = `translateX(${xPosition}%) translateZ(${zPosition}px) scale(${scale})`;
                slide.style.opacity = opacity;
                slide.style.zIndex = Math.floor(visibleSlides / 2) - Math.abs(offset);
                slide.style.filter = offset === 0 ? 'blur(0)' : 'blur(2px)';
                slide.style.pointerEvents = offset === 0 ? 'auto' : 'none';
            }
        });
        
        // Atualizar estado dos botões de navegação
        if (prevButton && nextButton) {
            prevButton.disabled = false;
            nextButton.disabled = false;
        }
    }
    
    // Funções de navegação
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    }
    
    // Controle do autoplay
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
        
        nextButton.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    
    // Adicionar navegação por toque
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe para esquerda
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe para direita
        }
    }
    
    // Inicializar carrossel
    updateCarousel();
    startAutoPlay();
    
    // Parar autoplay quando a página não estiver visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
});
