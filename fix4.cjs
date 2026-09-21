const fs = require('fs');
let code = fs.readFileSync('src/worlds/Brew.tsx', 'utf8').replace(/\r/g, '');

const oldTimeline = `      // 1. GRIND (0-100% of scene -> 0.0 to 1.0)
      brewTl.fromTo('.st-brew-bg-fill', { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none', immediateRender: false }, 0);
      brewTl.fromTo('.st-brew-grind', { scale: 1.0 }, { scale: 1.07, duration: 1.0, ease: 'none', immediateRender: false }, 0);
      brewTl.fromTo('.st-grind-beans', { scale: 0.92, rotation: 0 }, { scale: 1.0, rotation: 10, duration: 1.0, ease: 'none', immediateRender: false }, 0);
      
      brewTl.to('.st-grind-beans', { opacity: 0, duration: 0.25, ease: 'none' }, 0.45);
      brewTl.fromTo('.st-grind-grounds', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.25, ease: 'none', immediateRender: false }, 0.45);
      brewTl.to('.st-grind-grounds', { y: '2vh', duration: 0.3, ease: 'power1.out' }, 0.7);

      brewTl.to('.st-brew-grind', { opacity: 0, duration: 0.1 }, 1.0);

      // 2. WATER (1.0 to 2.0)
      brewTl.fromTo('.st-water-stream', { y: '-100vh', opacity: 0 }, { y: '-50vh', opacity: 1, duration: 0.2, ease: 'none', immediateRender: false }, 1.15);
      brewTl.to('.st-water-stream', { y: '-20vh', duration: 0.15, ease: 'none' }, 1.35);
      brewTl.to('.st-water-stream', { y: '0vh', duration: 0.15, ease: 'none' }, 1.50);
      brewTl.fromTo('.st-water-surface', { opacity: 0, scaleY: 0.8 }, { opacity: 1, scaleY: 1.0, duration: 0.15, ease: 'power1.out', immediateRender: false }, 1.65);
      brewTl.to('.st-water-stream', { opacity: 0, duration: 0.1, ease: 'power1.in' }, 1.80);
      brewTl.to('.st-water-surface', { scaleY: 1.05, duration: 0.1, ease: 'none' }, 1.80);
      brewTl.fromTo('.st-water-steam', { opacity: 0 }, { opacity: 0.4, duration: 0.1, ease: 'none', immediateRender: false }, 1.90);

      brewTl.to('.st-brew-water', { opacity: 0, duration: 0.1 }, 2.0);

      // 3. BLOOM (2.0 to 3.0)
      brewTl.to('.st-bloom-grounds', { filter: 'brightness(0.5)', duration: 0.2, ease: 'none' }, 2.4);
      brewTl.fromTo('.st-bloom-center', { scale: 1.00, opacity: 0 }, { opacity: 0.9, duration: 0.15, ease: 'none', immediateRender: false }, 2.6);
      brewTl.to('.st-bloom-center', { scale: 1.35, duration: 0.15, ease: 'power1.out' }, 2.6);
      brewTl.to('.st-bloom-center', { scale: 1.05, opacity: 0.7, duration: 0.15, ease: 'power1.inOut' }, 2.85);
      
      brewTl.fromTo('.st-bloom-steam', { opacity: 0 }, { opacity: 0.5, duration: 0.2, ease: 'none', immediateRender: false }, 2.6);
      brewTl.to('.st-bloom-steam', { opacity: 0.35, duration: 0.15, ease: 'none' }, 2.85);

      brewTl.fromTo('.st-bloom-text', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.2, ease: 'power1.out', immediateRender: false }, 2.3);

      brewTl.to('.st-brew-bloom', { opacity: 0, duration: 0.1 }, 3.0);

      // 4. POUR (3.0 to 4.0)
      brewTl.fromTo('.st-pour-vessel', { rotation: 0 }, { rotation: 8, duration: 0.8, ease: 'none', immediateRender: false }, 3.1);
      brewTl.fromTo('.st-pour-path', { strokeDashoffset: '301' }, { strokeDashoffset: '0', duration: 0.8, ease: 'none', immediateRender: false }, 3.1);
      brewTl.fromTo('.st-pour-ring', { scale: 0.2, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, 3.3);
      brewTl.to('.st-pour-ring', { scale: 1.0, duration: 0.4, ease: 'power1.inOut' }, 3.6);

      brewTl.fromTo('.st-pour-text', { opacity: 0, x: '-5vw' }, { opacity: 1, x: '0vw', duration: 0.3, ease: 'power1.out', immediateRender: false }, 3.2);

      brewTl.to('.st-brew-pour', { opacity: 0, duration: 0.1 }, 4.0);

      // 5. EXTRACTION (4.0 to 5.0)
      brewTl.fromTo('.st-extract-temp', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.15);
      brewTl.to('.st-extract-temp', { opacity: 0, y: '-5vh', duration: 0.15, ease: 'power2.in' }, 4.30);

      brewTl.fromTo('.st-extract-ratio', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.45);
      brewTl.to('.st-extract-ratio', { opacity: 0, y: '-5vh', duration: 0.15, ease: 'power2.in' }, 4.60);

      brewTl.fromTo('.st-extract-time', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.75);
      brewTl.to('.st-extract-time', { opacity: 0, y: '-5vh', duration: 0.15, ease: 'power2.in' }, 4.90);
      
      brewTl.fromTo('.st-extract-img', { scale: 1.0 }, { scale: 1.05, duration: 1.0, ease: 'none', immediateRender: false }, 4.0);

      brewTl.to('.st-brew-extract', { opacity: 0, duration: 0.1 }, 5.0);

      // 6. CUP (5.0 to 6.0)
      brewTl.fromTo('.st-cup-main', { scale: 0.84, y: '8vh' }, { scale: 1.0, y: '0vh', duration: 1.0, ease: 'power1.out', immediateRender: false }, 5.0);
      brewTl.fromTo('.st-cup-steam-final', { opacity: 0 }, { opacity: 0.55, duration: 0.5, ease: 'none', immediateRender: false }, 5.5);

      // 7. CUP -> SHOP (6.0 to 7.0)
      brewTl.to('.st-cup-main', { scale: 0.9, duration: 0.75, ease: 'power1.inOut' }, 6.25);
      brewTl.to('.st-brew-cup', { opacity: 0, duration: 0.25, ease: 'none' }, 6.75);`;

const newTimeline = `      // 1. GRIND (0.0 to 1.0)
      brewTl.fromTo('.st-brew-bg-fill', { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none', immediateRender: false }, 0);
      brewTl.fromTo('.st-grind-beans', { scale: 0.92, rotation: 0 }, { scale: 1.0, rotation: 6, duration: 0.25, ease: 'none', immediateRender: false }, 0);
      brewTl.fromTo('.st-brew-grind', { scale: 1.0 }, { scale: 1.07, duration: 0.25, ease: 'none', immediateRender: false }, 0.25);
      
      brewTl.to('.st-grind-beans', { opacity: 0, duration: 0.2, ease: 'none' }, 0.5);
      brewTl.fromTo('.st-grind-grounds', { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none', immediateRender: false }, 0.5);
      
      brewTl.fromTo('.st-grind-grounds', { y: '0vh' }, { y: '3vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 0.70);
      brewTl.to('.st-grind-grounds', { y: '2vh', duration: 0.15, ease: 'power1.inOut' }, 0.85);
      
      brewTl.to('.st-brew-grind', { opacity: 0, duration: 0.1 }, 1.0);

      // 2. WATER (1.0 to 2.0)
      brewTl.fromTo('.st-water-stream', { y: '-100vh', opacity: 0 }, { y: '-40vh', opacity: 1, duration: 0.2, ease: 'none', immediateRender: false }, 1.15);
      brewTl.to('.st-water-stream', { y: '0vh', duration: 0.15, ease: 'none' }, 1.35);
      
      brewTl.fromTo('.st-water-surface', { opacity: 0, scaleY: 0.8 }, { opacity: 1, scaleY: 1.0, duration: 0.15, ease: 'power1.out', immediateRender: false }, 1.50);
      brewTl.to('.st-water-stream', { scaleY: 0.9, y: '2vh', opacity: 0.8, duration: 0.15, ease: 'power1.inOut' }, 1.65);
      brewTl.fromTo('.st-water-steam', { opacity: 0, y: '5vh' }, { opacity: 0.5, y: '0vh', duration: 0.1, ease: 'power1.out', immediateRender: false }, 1.90);
      
      brewTl.to('.st-brew-water', { opacity: 0, duration: 0.1 }, 2.0);

      // 3. BLOOM (2.0 to 3.0)
      brewTl.fromTo('.st-bloom-text', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.2, ease: 'power1.out', immediateRender: false }, 2.0);
      brewTl.to('.st-bloom-grounds', { filter: 'brightness(0.6)', duration: 0.2, ease: 'none' }, 2.2);
      brewTl.to('.st-bloom-grounds', { filter: 'brightness(0.35)', duration: 0.15, ease: 'none' }, 2.4);
      
      brewTl.fromTo('.st-bloom-grounds', { scale: 1.00 }, { scale: 1.35, duration: 0.2, ease: 'power2.out', immediateRender: false, transformOrigin: 'center center' }, 2.55);
      brewTl.fromTo('.st-bloom-steam', { opacity: 0, scale: 0.8, y: '10vh' }, { opacity: 0.5, scale: 1.1, y: '0vh', duration: 0.3, ease: 'power1.out', immediateRender: false }, 2.55);
      
      brewTl.to('.st-bloom-grounds', { scale: 1.05, duration: 0.15, ease: 'power2.inOut' }, 2.85);
      brewTl.to('.st-bloom-steam', { opacity: 0.4, scale: 1.15, duration: 0.15, ease: 'none' }, 2.85);

      brewTl.to('.st-brew-bloom', { opacity: 0, duration: 0.1 }, 3.0);

      // 4. POUR (3.0 to 4.0)
      brewTl.fromTo('.st-pour-vessel', { rotation: 0 }, { rotation: 8, duration: 0.8, ease: 'power1.inOut', immediateRender: false }, 3.1);
      brewTl.fromTo('.st-pour-path', { strokeDashoffset: '301' }, { strokeDashoffset: '0', duration: 0.8, ease: 'power1.inOut', immediateRender: false }, 3.1);
      
      brewTl.fromTo('.st-pour-ring', { scale: 0.2, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, 3.3);
      brewTl.to('.st-pour-ring', { scale: 1.0, opacity: 0.8, duration: 0.4, ease: 'power1.inOut' }, 3.6);

      brewTl.fromTo('.st-pour-text', { opacity: 0, x: '-2.5vw' }, { opacity: 1, x: '0vw', duration: 0.3, ease: 'power1.out', immediateRender: false }, 3.2);

      brewTl.to('.st-brew-pour', { opacity: 0, duration: 0.1 }, 4.0);

      // 5. EXTRACTION (4.0 to 5.0)
      brewTl.fromTo('.st-extract-img', { scale: 1.0 }, { scale: 1.05, duration: 1.0, ease: 'none', immediateRender: false }, 4.0);

      brewTl.fromTo('.st-extract-temp', { opacity: 0, y: '3vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.10);
      brewTl.to('.st-extract-temp', { opacity: 0.3, duration: 0.15, ease: 'power2.inOut' }, 4.35);

      brewTl.fromTo('.st-extract-ratio', { opacity: 0, y: '3vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.40);
      brewTl.to('.st-extract-ratio', { opacity: 0.3, duration: 0.15, ease: 'power2.inOut' }, 4.65);

      brewTl.fromTo('.st-extract-time', { opacity: 0, y: '3vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.70);

      brewTl.to('.st-brew-extract', { opacity: 0, duration: 0.1 }, 5.0);

      // 6. CUP (5.0 to 6.0)
      brewTl.fromTo('.st-cup-main', { scale: 0.84, y: '8vh' }, { scale: 1.0, y: '0vh', duration: 1.0, ease: 'power2.out', immediateRender: false }, 5.0);
      brewTl.fromTo('.st-cup-steam-final', { opacity: 0, y: '10px' }, { opacity: 0.5, y: '-25px', duration: 0.8, ease: 'power1.out', immediateRender: false }, 5.2);

      // 7. CUP -> SHOP (6.0 to 7.0)
      brewTl.to('.st-cup-main', { scale: 1.05, duration: 0.2, ease: 'power1.inOut' }, 6.0);
      brewTl.to('.st-brew-cup', { scale: 0.9, y: '-10vh', duration: 0.15, ease: 'power1.inOut' }, 6.35);
      brewTl.to('.st-brew-cup', { opacity: 0, scale: 0.8, y: '-20vh', duration: 0.15, ease: 'power1.in' }, 6.75);`;

if (!code.includes(oldTimeline)) {
    console.error("Timeline text not found in source file.");
    process.exit(1);
}

code = code.replace(oldTimeline, newTimeline);

const oldBloomJSX = `<div className="st-brew-bloom absolute inset-0 flex items-center justify-center bg-[#1A100C] z-40 overflow-hidden">
          <img
            src={BREW_IMAGES.bloom.url}
            alt={BREW_IMAGES.bloom.alt}
            loading="lazy"
            decoding="async"
            className="st-bloom-grounds absolute top-0 right-0 w-[120vw] md:w-[70vw] h-[70vh] md:h-screen object-cover opacity-70"
            style={{ objectPosition: BREW_IMAGES.bloom.position }}
          />
          <div className="st-bloom-center absolute right-[10%] md:right-[20%] w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] bg-[#3B2516]/80 rounded-full blur-[80px] opacity-0 mix-blend-screen" />
          <div className="st-bloom-steam absolute top-1/4 right-[5%] w-[80vw] md:w-[50vw] h-[60vh] bg-white/10 blur-[80px] opacity-0" />
          <div className="st-bloom-text absolute bottom-[15%] md:bottom-[20%] left-[6%] md:left-[10%] z-20 text-[20vw] md:text-[16vw] font-display text-white mix-blend-difference tracking-tighter uppercase pointer-events-none leading-[0.8] opacity-95">BLOOM</div>
        </div>`;

const newBloomJSX = `<div className="st-brew-bloom absolute inset-0 flex items-center justify-center bg-[#1A100C] z-40 overflow-hidden">
          <img
            src={BREW_IMAGES.bloom.url}
            alt={BREW_IMAGES.bloom.alt}
            loading="lazy"
            decoding="async"
            className="st-bloom-grounds absolute top-0 right-0 w-[120vw] md:w-[70vw] h-[70vh] md:h-screen object-cover opacity-70 origin-center"
            style={{ objectPosition: BREW_IMAGES.bloom.position }}
          />
          <div className="st-bloom-steam absolute top-1/4 right-[5%] w-[80vw] md:w-[50vw] h-[60vh] bg-white/10 blur-[80px] opacity-0" />
          <div className="st-bloom-text absolute bottom-[15%] md:bottom-[20%] left-[6%] md:left-[10%] z-20 text-[20vw] md:text-[16vw] font-display text-white mix-blend-difference tracking-tighter uppercase pointer-events-none leading-[0.8] opacity-95">BLOOM</div>
        </div>`;

if (!code.includes(oldBloomJSX)) {
    console.error("Bloom JSX text not found in source file.");
    process.exit(1);
}

code = code.replace(oldBloomJSX, newBloomJSX);

// Write with CRLF to match git format just in case, though node will probably write LF
fs.writeFileSync('src/worlds/Brew.tsx', code);
console.log("Success");
