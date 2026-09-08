import React, { useEffect, useRef } from 'react';
import { useExperienceStore } from '../experience/store';

// Fast noise implementation
class Grad {
  x: number; y: number; z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x; this.y = y; this.z = z;
  }
  dot2(x: number, y: number) { return this.x * x + this.y * y; }
}

class Noise {
  grad3: Grad[]; p: number[]; perm: number[]; gradP: Grad[];
  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
      new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
      new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
    ];
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
      21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
      237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
      111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216,
      80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
      3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
      17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
      129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
      238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
      195, 78, 66, 215, 61, 156, 180
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }
  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i++) {
      let v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }
  fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a: number, b: number, t: number) { return (1 - t) * a + t * b; }
  perlin2(x: number, y: number) {
    let X = Math.floor(x), Y = Math.floor(y);
    x -= X; y -= Y;
    X &= 255; Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};
const interpolateColor = (c1: number[], c2: number[], t: number) => {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t)
  ];
};

export default function ReactiveField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const noise = new Noise(Math.random());
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    
    // Grid state
    let cols = 0;
    let rows = 0;
    let grid: { ox: number, oy: number, x: number, y: number, dotX: number, dotY: number }[][] = [];

    const setupGrid = () => {
      // Density based on device
      let baseSpacing = 40;
      if (window.innerWidth < 768) baseSpacing = 60; // Mobile: less dense (approx 35% less)
      else if (window.innerWidth < 1024) baseSpacing = 50; // Tablet: less dense (approx 20% less)

      const margin = 200; // Allow compression without popping
      cols = Math.ceil((width/dpr + margin*2) / baseSpacing);
      rows = Math.ceil((height/dpr + margin*2) / baseSpacing);

      grid = [];
      for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
          row.push({
            ox: -margin + c * baseSpacing,
            oy: -margin + r * baseSpacing,
            x: 0, y: 0, dotX: 0, dotY: 0
          });
        }
        grid.push(row);
      }
    };

    const resize = () => {
      if (!containerRef.current) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = containerRef.current.clientWidth * dpr;
      height = containerRef.current.clientHeight * dpr;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${containerRef.current.clientWidth}px`;
      canvas.style.height = `${containerRef.current.clientHeight}px`;
      ctx.scale(dpr, dpr);
      setupGrid();
    };

    window.addEventListener('resize', resize);
    // Touch interactions are disabled per requirements, so we do not bind touchmove
    resize();

    let smoothedVelocity = 0;
    let lastScroll = 0;
    const startTime = Date.now();

    const getParams = () => {
      const state = useExperienceStore.getState();
      const p = state.globalProgress;

      const states = [
        { p: 0.00, disp: 0.2, op: 0.15, spd: 0.2, ptr: 0.1, dirX: 0, dirY: 0, rad: 0, color: [200, 200, 200] }, // ENTRY
        { p: 0.15, disp: 0.6, op: 0.35, spd: 0.35, ptr: 0.2, dirX: 0.1, dirY: 0.3, rad: 0, color: [139, 157, 131] }, // ORIGIN
        { p: 0.35, disp: 1.0, op: 0.50, spd: 1.0, ptr: 0.4, dirX: 0.8, dirY: -0.2, rad: 0, color: [153, 92, 43] }, // ROAST
        { p: 0.55, disp: 0.8, op: 0.40, spd: 0.8, ptr: 0.5, dirX: 0, dirY: 0.8, rad: 0.5, color: [45, 27, 17] }, // BREW
        { p: 0.80, disp: 0.5, op: 0.20, spd: 0.45, ptr: 0.5, dirX: 0, dirY: 0.1, rad: 0, color: [60, 60, 60] }, // SHOP
        { p: 1.00, disp: 0.2, op: 0.15, spd: 0.2, ptr: 0.2, dirX: 0, dirY: 0, rad: 0, color: [60, 60, 60] } // END
      ];

      let base = { ...states[0] };
      for (let i = 0; i < states.length - 1; i++) {
        if (p >= states[i].p && p <= states[i + 1].p) {
          const t = (p - states[i].p) / (states[i + 1].p - states[i].p);
          const tSmooth = smoothstep(0, 1, t);
          base = {
            disp: lerp(states[i].disp, states[i + 1].disp, tSmooth),
            op: lerp(states[i].op, states[i + 1].op, tSmooth),
            spd: lerp(states[i].spd, states[i + 1].spd, tSmooth),
            ptr: lerp(states[i].ptr, states[i + 1].ptr, tSmooth),
            dirX: lerp(states[i].dirX, states[i + 1].dirX, tSmooth),
            dirY: lerp(states[i].dirY, states[i + 1].dirY, tSmooth),
            rad: lerp(states[i].rad, states[i + 1].rad, tSmooth),
            color: interpolateColor(states[i].color, states[i + 1].color, tSmooth)
          };
          break;
        }
      }
      if (p > states[states.length - 1].p) base = { ...states[states.length - 1] };

      let compression = 1.0;
      let activeWorld = state.activeWorld;

      // --- ROAST OVERRIDES ---
      if (activeWorld === 'roast' || (p > 0.15 && p < 0.55)) {
        const rProg = state.roastDevelopment || 0;
        compression = lerp(1.0, 0.82, rProg);
        base.disp = lerp(base.disp, base.disp * 1.35, rProg);
        base.spd = lerp(base.spd, base.spd * 1.25, rProg);

        // First Crack Event (0.62 - 0.68)
        if (rProg > 0.5 && rProg < 0.7) {
          if (rProg < 0.62) {
            const t = (rProg - 0.5) / 0.12;
            base.disp *= (1 + 0.15 * t);
            base.spd *= (1 + 0.10 * t);
          } else if (rProg >= 0.62 && rProg <= 0.68) {
            const t = (rProg - 0.62) / 0.06;
            const spike = Math.sin(t * Math.PI);
            base.rad += spike * 0.25;
            base.disp *= (1 + 0.35 * spike);
          }
        }
      }

      // --- BREW OVERRIDES ---
      if (activeWorld === 'brew' || (p > 0.35 && p < 0.80)) {
        const bProg = state.brewProgress || 0;
        
        // Bloom radial (0.35 - 0.80)
        if (bProg >= 0.35 && bProg <= 0.80) {
          let bloomT = 0;
          if (bProg < 0.60) bloomT = (bProg - 0.35) / 0.25;
          else bloomT = 1 - (bProg - 0.60) / 0.20;
          bloomT = Math.max(0, bloomT);
          base.rad = lerp(base.rad, 1.0, bloomT);
        }
        
        // Pour downward directional bias (0.50 - 0.72)
        if (bProg >= 0.50 && bProg <= 0.72) {
          const pourT = Math.sin(((bProg - 0.50) / 0.22) * Math.PI);
          base.dirY += pourT * 1.5;
          base.spd *= (1 + 0.15 * pourT);
        }

        // Cup settlement (0.90+)
        if (bProg >= 0.90) {
          const cupT = (bProg - 0.90) / 0.10;
          base.spd *= lerp(1, 0.65, cupT);
          base.ptr *= lerp(1, 0.50, cupT);
          base.disp *= lerp(1, 0.60, cupT);
          base.op *= lerp(1, 0.85, cupT); // -15% density -> visually opacity handles density feel best on grid
        }
      }

      // --- SCROLL VELOCITY ---
      const currentScroll = state.scroll;
      const rawVelocity = currentScroll - lastScroll;
      lastScroll = currentScroll;
      smoothedVelocity += (Math.abs(rawVelocity) - smoothedVelocity) * 0.1;
      
      let vMult = 1.0;
      if (smoothedVelocity > 0) {
        vMult = 1.0 + Math.min(0.30, smoothedVelocity * 0.005);
        base.spd *= vMult;
        base.disp *= vMult;
      }
      
      base.op = Math.min(0.50, Math.max(0.0, base.op * Math.min(1.5, vMult)));
      
      // Prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
         base.spd *= 0.2;
         base.disp *= 0.3;
         base.ptr = 0;
      }

      return { ...base, compression };
    };

    const tick = () => {
      const time = (Date.now() - startTime) * 0.001;
      const params = getParams();
      
      const { pointer } = useExperienceStore.getState();
      mouse.targetX = pointer.x === -1000 ? -1000 : pointer.x;
      mouse.targetY = pointer.y === -1000 ? -1000 : pointer.y;

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width / dpr, height / dpr);

      const w = width / dpr;
      const h = height / dpr;
      const cx = w / 2;
      const cy = h / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let p = grid[r][c];
          
          let bx = p.ox;
          let by = p.oy;
          
          if (params.compression < 1.0) {
            bx = cx + (bx - cx) * params.compression;
          }
          
          const tSpd = time * params.spd;
          const nx = noise.perlin2(bx * 0.002 + tSpd + params.dirX * time, by * 0.002) * 30 * params.disp;
          const ny = noise.perlin2(bx * 0.002, by * 0.002 + tSpd + params.dirY * time) * 30 * params.disp;
          
          let tx = bx + nx;
          let ty = by + ny;
          
          if (params.rad > 0) {
            let dx = tx - cx;
            let dy = ty - cy;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0 && dist < 500) {
              let force = (1 - dist/500) * params.rad * 40;
              tx += (dx/dist) * force;
              ty += (dy/dist) * force;
            }
          }
          
          let ptx = 0, pty = 0;
          if (params.ptr > 0 && mouse.x > -100) {
            let dx = tx - mouse.x;
            let dy = ty - mouse.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 200) {
              let force = (1 - dist/200) * params.ptr;
              ptx = (dx/dist) * force * 18; 
              pty = (dy/dist) * force * 18;
            }
          }
          
          p.x = tx + ptx * 0.66; // Lines displaced max 12px
          p.y = ty + pty * 0.66;
          p.dotX = tx + ptx; // Dots displaced max 18px
          p.dotY = ty + pty;
        }
      }
      
      const [cr, cg, cb] = params.color;
      
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${params.op * 0.6})`;
      ctx.lineWidth = 1;
      
      // Draw horizontal contours
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let p = grid[r][c];
          if (c === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();

      // Draw dots
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let p = grid[r][c];
          ctx.moveTo(p.dotX, p.dotY);
          ctx.arc(p.dotX, p.dotY, 1.2, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${params.op})`;
      ctx.fill();

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply transition-opacity duration-300"
      style={{
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 60%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,1) 60%)'
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
