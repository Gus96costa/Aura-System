import gsap from 'gsap';
import { createIcons, PenTool, Settings2, Zap, Orbit, Fingerprint, Spline, ShieldCheck, Infinity } from 'lucide';
const carouselIcons = { PenTool, Settings2, Zap, Orbit, Fingerprint, Spline, ShieldCheck, Infinity };

export const heroCarouselData = [
    {
        title: "Design Premium",
        desc: "Estética Minimalista. Linhas puras esculpidas para uma experiência visual sem distrações.",
        icon: "pen-tool",
        statsHTML: `
            <div>
                <span class="block text-[10px] uppercase font-mono text-stone-400 mb-1">Acabamento</span>
                <span class="font-display font-medium text-stone-900 text-xl">Fosco<span class="text-sm text-stone-500"> Abs</span></span>
            </div>
            <div>
                <span class="block text-[10px] uppercase font-mono text-stone-400 mb-1">Forma</span>
                <span class="font-display font-medium text-stone-900 text-xl">Pura</span>
            </div>
        `
    },
    {
        title: "Engenharia",
        desc: "Balanceamento perfeito com distribuição de peso alocada precisamente no centro de gravidade inferior.",
        icon: "settings-2",
        statsHTML: `
            <div>
                <span class="block text-[10px] uppercase font-mono text-stone-400 mb-1">Peso Ideal</span>
                <span class="font-display font-medium text-stone-900 text-xl">32<span class="text-sm text-stone-500">g</span></span>
            </div>
            <div>
                <span class="block text-[10px] uppercase font-mono text-stone-400 mb-1">Corpo Externo</span>
                <span class="font-display font-medium text-stone-900 text-xl">N5<span class="text-sm text-stone-500"> Titânio</span></span>
            </div>
        `
    },
    {
        title: "Performance",
        desc: "Fluxo Ininterrupto. Tecnologia Smart-Flow que garante escrita constante em qualquer inclinação.",
        icon: "zap",
        statsHTML: `
            <div>
                <span class="block text-[10px] uppercase font-mono text-stone-400 mb-1">Pressão</span>
                <span class="font-display font-medium text-stone-900 text-xl">45<span class="text-sm text-stone-500"> PSI</span></span>
            </div>
            <div>
                <span class="block text-[10px] uppercase font-mono text-stone-400 mb-1">Traço</span>
                <span class="font-display font-medium text-stone-900 text-xl">0.5<span class="text-sm text-stone-500"> mm</span></span>
            </div>
        `
    }
];

export let currentHeroCardIndex = -1;
export let heroCarouselTimer;

export function updateHeroCarousel(index) {
    if (index === currentHeroCardIndex) return;
    const data = heroCarouselData[index];
    const contentContainer = document.getElementById("hero-card-content");
    const indicators = document.querySelectorAll(".indicator-item");

    if (!contentContainer) return;

    // Update Indicators
    indicators.forEach((ind, i) => {
        const lineSpan = ind.querySelector('span:nth-child(2)');
        if (i === index) {
            ind.classList.add('text-stone-900');
            ind.classList.remove('text-stone-400');
            lineSpan.classList.add('w-8', 'bg-stone-900');
            lineSpan.classList.remove('w-4', 'bg-stone-400', 'group-hover:bg-stone-900', 'group-hover:w-8');
        } else {
            ind.classList.remove('text-stone-900');
            ind.classList.add('text-stone-400');
            lineSpan.classList.remove('w-8', 'bg-stone-900');
            lineSpan.classList.add('w-4', 'bg-stone-400', 'group-hover:bg-stone-900', 'group-hover:w-8');
        }
    });

    // Animate Card
    if (currentHeroCardIndex !== -1) {
        gsap.to(contentContainer, {
            opacity: 0,
            y: 5,
            duration: 0.3,
            onComplete: () => {
                document.getElementById("hero-card-title").innerText = data.title;
                document.getElementById("hero-card-desc").innerText = data.desc;
                document.getElementById("hero-card-stats").innerHTML = data.statsHTML;
                document.getElementById("hero-card-icon").innerHTML = `<i data-lucide="${data.icon}" aria-hidden="true" class="w-5 h-5"></i>`;
                createIcons({ icons: carouselIcons });

                gsap.to(contentContainer, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    } else {
        document.getElementById("hero-card-title").innerText = data.title;
        document.getElementById("hero-card-desc").innerText = data.desc;
        document.getElementById("hero-card-stats").innerHTML = data.statsHTML;
        document.getElementById("hero-card-icon").innerHTML = `<i data-lucide="${data.icon}" aria-hidden="true" class="w-5 h-5"></i>`;
        createIcons({ icons: carouselIcons });
    }

    currentHeroCardIndex = index;

    if (heroCarouselTimer) heroCarouselTimer.kill();
    heroCarouselTimer = gsap.delayedCall(5, () => {
        updateHeroCarousel((currentHeroCardIndex + 1) % heroCarouselData.length);
    });
}

// Inicializa a lógica interativa para os indicadores da Hero
export function initHeroCarousel() {
    const indicatorsElements = document.querySelectorAll(".indicator-item");
    indicatorsElements.forEach((ind) => {
        ind.addEventListener("click", () => {
            const idx = parseInt(ind.getAttribute("data-index"));
            updateHeroCarousel(idx);
        });
    });
    // Dispara inicial
    updateHeroCarousel(0);
}


// --- TECH SECTION HORIZONTAL CAROUSEL ---
let techTrack;
let originalCards;
let techPrev;
let techNext;
let techDotsContainer;

export let techCurrentIndex = 2;
export let techCards = [];
export let techDotsElems = [];
export let techCarouselTimer;
export let originalCount = 0;
export let isAnimating = false;
let cardDimensionsCache = [];


export function initTechCarousel() {
    techTrack = document.getElementById("tech-carousel-track");
    if(!techTrack) return;
    
    originalCards = document.querySelectorAll(".tech-carousel-card");
    techPrev = document.getElementById("tech-prev");
    techNext = document.getElementById("tech-next");
    techDotsContainer = document.getElementById("tech-dots");
    originalCount = originalCards.length;

    if (originalCount > 0) {
        originalCards.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.className = "w-2 h-2 box-content p-2 bg-clip-content rounded-full transition-all duration-500 bg-stone-300";
            dot.setAttribute("aria-label", "Ir para o slide tecnológico " + (i + 1));
            if (i === 0) {
                dot.classList.replace("bg-stone-300", "bg-stone-900");
                dot.classList.add("w-6");
            }
            dot.addEventListener("click", () => goTechSlide(i + 2));
            techDotsContainer.appendChild(dot);
            techDotsElems.push(dot);
        });

        // CLONAGEM PARA LOOP INFINITO
        const first1 = originalCards[0].cloneNode(true);
        const first2 = originalCards[1].cloneNode(true);
        const last2 = originalCards[originalCount - 2].cloneNode(true);
        const last1 = originalCards[originalCount - 1].cloneNode(true);

        first1.onclick = () => goTechSlide(originalCount + 2);
        first2.onclick = () => goTechSlide(originalCount + 3);
        last2.onclick = () => goTechSlide(0);
        last1.onclick = () => goTechSlide(1);

        originalCards.forEach((card, i) => {
            card.onclick = () => goTechSlide(i + 2);
        });

        techTrack.prepend(last2, last1);
        techTrack.append(first1, first2);

        techCards = document.querySelectorAll(".tech-carousel-card");
        cardDimensionsCache = Array.from(techCards).map(card => ({
            left: card.offsetLeft,
            width: card.offsetWidth
        }));

        createIcons({ icons: carouselIcons });

        setTimeout(() => {
            cardDimensionsCache = Array.from(techCards).map(card => ({
                left: card.offsetLeft,
                width: card.offsetWidth
            }));
            goTechSlide(2, true);
        }, 100);
        window.addEventListener("resize", () => {
            cardDimensionsCache = Array.from(techCards).map(card => ({
                left: card.offsetLeft,
                width: card.offsetWidth
            }));
            goTechSlide(techCurrentIndex, true);
        });
    }

    if (techPrev) techPrev.addEventListener("click", () => goTechSlide(techCurrentIndex - 1));
    if (techNext) techNext.addEventListener("click", () => goTechSlide(techCurrentIndex + 1));
}

export function goTechSlide(index, instant = false) {
    if (isAnimating && !instant) return;

    if (techCarouselTimer) techCarouselTimer.kill();
    techCarouselTimer = gsap.delayedCall(5, () => {
        goTechSlide(techCurrentIndex + 1);
    });

    if (!instant) isAnimating = true;
    techCurrentIndex = index;

    let realIndex = index - 2;
    if (realIndex < 0) realIndex = originalCount + realIndex; 
    if (realIndex >= originalCount) realIndex = realIndex % originalCount;

    techDotsElems.forEach((dot, i) => {
        if (i === realIndex) {
            dot.classList.replace("bg-stone-300", "bg-stone-900");
            dot.classList.add("w-6");
        } else {
            dot.classList.replace("bg-stone-900", "bg-stone-300");
            dot.classList.remove("w-6");
        }
    });

    const docWidth = window.innerWidth;
    const centerX = docWidth / 2;
    const cardElement = techCards[index];
    if(!cardElement) return;
    
    const cachedDims = cardDimensionsCache[index] || { left: cardElement.offsetLeft, width: cardElement.offsetWidth };
    const cardLeft = cachedDims.left;
    const cardWidth = cachedDims.width;
    const targetX = centerX - cardLeft - (cardWidth / 2);

    if (instant) {
        gsap.set(techTrack, { x: targetX });
        isAnimating = false;
    } else {
        gsap.to(techTrack, {
            x: targetX,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                isAnimating = false;
                if (index < 2) {
                    goTechSlide(index + originalCount, true);
                } else if (index >= originalCount + 2) {
                    goTechSlide(index - originalCount, true);
                }
            }
        });
    }

    techCards.forEach((card, i) => {
        if (i === index) {
            if (instant) { gsap.set(card, { scale: 1, opacity: 1 }); }
            else { gsap.to(card, { scale: 1, opacity: 1, duration: 0.8, ease: "power3.inOut" }); }
            card.style.zIndex = 40;
        } else {
            if (instant) { gsap.set(card, { scale: 0.85, opacity: 0.4 }); }
            else { gsap.to(card, { scale: 0.85, opacity: 0.4, duration: 0.8, ease: "power3.inOut" }); }
            card.style.zIndex = 30;
        }
    });
}
