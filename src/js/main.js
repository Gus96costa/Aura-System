import '../css/style.css';
import { preloadImages } from './canvas.js';
import { initHeroCarousel, initTechCarousel, goTechSlide } from './carousel.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createIcons, ArrowRight, PenTool, Crosshair, Zap, Shield, Settings, Droplet, Asterisk, Orbit, Fingerprint, Spline, ShieldCheck, ArrowLeft, Infinity, CircleDot } from 'lucide';
const usedIcons = { ArrowRight, PenTool, Crosshair, Zap, Shield, Settings, Droplet, Asterisk, Orbit, Fingerprint, Spline, ShieldCheck, ArrowLeft, Infinity, CircleDot };


gsap.registerPlugin(ScrollTrigger);

window.goTechSlide = goTechSlide;

document.addEventListener("DOMContentLoaded", () => {
    
    // Init Icons
    createIcons({ icons: usedIcons });

    // Initialize modules
    preloadImages();
    initHeroCarousel();
    initTechCarousel();

    // Flashlight effect logic
    window.updateFlashlight = function(e, card) {
        if (!card._rectCache) {
            card._rectCache = card.getBoundingClientRect();
            card.addEventListener('mouseleave', () => { card._rectCache = null; }, { once: true });
        }
        const rect = card._rectCache;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    // Initialize Smooth Scroll (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // Header Transparency on Scroll
    const mainHeader = document.getElementById('main-header');
    if(mainHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.remove('bg-transparent');
                mainHeader.classList.add('bg-surface-light/80', 'backdrop-blur-md', 'border-b', 'border-stone-300');
            } else {
                mainHeader.classList.add('bg-transparent');
                mainHeader.classList.remove('bg-surface-light/80', 'backdrop-blur-md', 'border-b', 'border-stone-300');
            }
        });
    }

    // Nav anchor integration with Lenis
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                lenis.scrollTo(target, {
                    offset: -0,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            e.preventDefault();

            if (mainHeader) {
                mainHeader.classList.add('bg-transparent');
                mainHeader.classList.remove('bg-surface-light/80', 'backdrop-blur-md', 'border-b', 'border-stone-300');
            }

            lenis.scrollTo(0, {
                duration: 2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    }

    // Reveal Animations on Scroll
    gsap.utils.toArray('.reveal-trigger').forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1.2,
            ease: "expo.out"
        });
    });

    // Lazy loading do vídeo de tecnologia com IntersectionObserver
    const techVideo = document.getElementById('tech-video');
    const techSection = document.getElementById('tecnologia');

    if (techVideo && techSection) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    techVideo.play().catch(err => console.log("Autoplay bloqueado:", err));
                    videoObserver.unobserve(techSection); // Desativa o observer após o primeiro trigger
                }
            });
        }, { rootMargin: '200px' }); // Inicia o download 200px antes da seção entrar na tela

        videoObserver.observe(techSection);
    }

});
