import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initial Load Animations
export const introTimeline = gsap.timeline({ delay: 0.1, paused: true });

introTimeline.to(".hero-text", {
    y: "0%",
    duration: 1.2,
    stagger: 0.1,
    ease: "expo.out"
})
    .to(".hero-fade", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out"
    }, "-=0.8");

const canvas = document.getElementById("hero-canvas");
let ctx = null;
if (canvas) {
    ctx = canvas.getContext("2d");
}

const frameCount = 192;
const currentFrame = index => {
    const frameNumber = (index + 1).toString().padStart(4, '0');
    return `/assets/raw_files/Video_frames/frame_${frameNumber}.webp`;
};

const images = [];
const airpods = { frame: 0 };

export async function preloadImages() {
    if (!canvas || !ctx) return;
    
    const loaderBar = document.createElement("div");
    loaderBar.style.cssText = "position: fixed; top: 0; left: 0; width: 0%; height: 1px; background-color: #1c1917; z-index: 99999; transition: width 0.1s; pointer-events: none;";
    document.body.appendChild(loaderBar);

    let loadedCount = 0;
    const promises = [];

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);

        const promise = img.decode().then(() => {
            loadedCount++;
            loaderBar.style.width = `${(loadedCount / frameCount) * 100}%`;

            if (i === 0) {
                render();
                initGSAP();
            }
        }).catch(() => {
            loadedCount++;
        });

        promises.push(promise);
    }

    await Promise.allSettled(promises);

    loaderBar.style.transition = "opacity 0.3s";
    loaderBar.style.opacity = "0";
    setTimeout(() => loaderBar.remove(), 300);

    introTimeline.play();
}

export function initGSAP() {
    const sequenceTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero-parallax",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
        }
    });

    sequenceTl.to(airpods, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
    }, 0);

    sequenceTl.to(".hero-text, .hero-fade", {
        opacity: 0,
        y: -100,
        stagger: 0.05,
        ease: "power2.in",
        immediateRender: false
    }, 0.5);
}

export function render() {
    if (!ctx) return;
    const img = images[airpods.frame];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}
