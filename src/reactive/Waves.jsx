import { useRef, useEffect } from 'react';
import './Waves.css';

class Grad {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  dot2(x, y) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1)
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
  seed(seed) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i++) {
      let v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
  perlin2(x, y) {
    let X = Math.floor(x),
      Y = Math.floor(y);
    x -= X;
    y -= Y;
    X &= 255;
    Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

const Waves = ({
  lineColor = 'black',
  backgroundColor = 'transparent',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  style = {},
  className = ''
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const boundingRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const noiseRef = useRef(new Noise(Math.random()));
  const linesRef = useRef([]);
  const mouseRef = useRef({
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false
  });
  const configRef = useRef({
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap
  });
  const frameIdRef = useRef(null);

  useEffect(() => {
    configRef.current = {
      lineColor,
      waveSpeedX,
      waveSpeedY,
      waveAmpX,
      waveAmpY,
      friction,
      tension,
      maxCursorMove,
      xGap,
      yGap
    };
  }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    ctxRef.current = canvas.getContext('2d');
    let ripples = [];

    function setSize() {
      boundingRef.current = container.getBoundingClientRect();
      canvas.width = boundingRef.current.width;
      canvas.height = boundingRef.current.height;
    }

    function setLines() {
      const { width, height } = boundingRef.current;
      linesRef.current = [];
      const oWidth = width + 200,
        oHeight = height + 30;
      const { xGap, yGap } = configRef.current;
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;
      for (let i = 0; i <= totalLines; i++) {
        const pts = [];
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 }
          });
        }
        linesRef.current.push(pts);
      }
    }

    function movePoints(time) {
      const lines = linesRef.current,
        mouse = mouseRef.current,
        noise = noiseRef.current;
      const { waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove } = configRef.current;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += 18; // Expansion speed matches DotGrid
        ripples[i].life -= 0.015; // Fade speed matches DotGrid
        if (ripples[i].life <= 0) ripples.splice(i, 1);
      }

      for (let i = 0, lenLines = lines.length; i < lenLines; i++) {
        const pts = lines[i];
        for (let j = 0, lenPts = pts.length; j < lenPts; j++) {
          const p = pts[j];
          const move = noise.perlin2((p.x + time * waveSpeedX) * 0.002, (p.y + time * waveSpeedY) * 0.0015) * 12;
          p.wave.x = Math.cos(move) * waveAmpX;
          p.wave.y = Math.sin(move) * waveAmpY;

          const dx = p.x - mouse.sx,
            dy = p.y - mouse.sy;
          const l = Math.max(175, mouse.vs);
          
          if (dx > -l && dx < l && dy > -l && dy < l) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < l) {
              const s = 1 - dist / l;
              const f = Math.cos(dist * 0.001) * s;
              p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
              p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
            }
          }

          // Apply click ripples
          if (ripples.length > 0) {
            for (let k = 0, lenRipples = ripples.length; k < lenRipples; k++) {
              const ripple = ripples[k];
              const rdx = p.x - ripple.x;
              const rdy = p.y - ripple.y;
              
              const ringThickness = 80; // slightly wider than dots for a smooth string pluck
              const bound = ripple.radius + ringThickness;
              
              if (rdx > -bound && rdx < bound && rdy > -bound && rdy < bound) {
                const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
                const distToRing = Math.abs(rDist - ripple.radius);
                
                if (distToRing < ringThickness) {
                  const force = (1 - distToRing / ringThickness) * ripple.life * 15;
                  const angle = Math.atan2(rdy, rdx);
                  
                  // Pluck the string outward from the ripple center
                  p.cursor.vx += Math.cos(angle) * force;
                  p.cursor.vy += Math.sin(angle) * force;
                }
              }
            }
          }

          p.cursor.vx += (0 - p.cursor.x) * tension;
          p.cursor.vy += (0 - p.cursor.y) * tension;
          p.cursor.vx *= friction;
          p.cursor.vy *= friction;
          p.cursor.x += p.cursor.vx * 2;
          p.cursor.y += p.cursor.vy * 2;
          p.cursor.x = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.x));
          p.cursor.y = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.y));
        }
      }
    }

    // Temporary objects to avoid garbage collection pauses in the rendering loop
    const tempP1 = { x: 0, y: 0 };
    const tempP2 = { x: 0, y: 0 };

    function moveInto(outObj, point, withCursor = true) {
      const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0);
      const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0);
      // Math.round is expensive and unnecessary for sub-pixel canvas rendering
      outObj.x = x;
      outObj.y = y;
    }

    function drawLines() {
      const { width, height } = boundingRef.current;
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;
      
      const t08 = time * 0.8;
      const t04 = time * 0.4;
      const t1 = time;

      for (let i = 0, lenLines = linesRef.current.length; i < lenLines; i++) {
        const points = linesRef.current[i];
        ctx.beginPath();
        moveInto(tempP1, points[0], false);
        ctx.moveTo(tempP1.x, tempP1.y);
        
        const lineX = points[0].x;

        for (let j = 0, lenPts = points.length; j < lenPts; j++) {
          const p = points[j];
          const isLast = j === lenPts - 1;
          moveInto(tempP1, p, !isLast);
          
          ctx.lineTo(tempP1.x, tempP1.y);
          if (isLast) {
            moveInto(tempP2, points[j + 1] || points[lenPts - 1], !isLast);
            ctx.moveTo(tempP2.x, tempP2.y);
          }
        }

        const grad = ctx.createLinearGradient(0, 0, 0, height);
        
        // Add subtle flowing green heat to some lines based on perlin-like trig functions
        const heat = Math.sin(lineX * 0.005 - t08) * Math.cos(lineX * 0.008 + t04);
        
        // To make the metallic strings feel dimensional, add a moving highlight position
        const highlightPos = 0.5 + Math.sin(lineX * 0.01 + t1) * 0.2;
        
        if (heat > 0.35) { // Lowered threshold for more frequent appearance
           const intensity = Math.min(1, (heat - 0.35) * 1.5); // 0 to 1
           grad.addColorStop(0, `rgba(22, 20, 18, ${0.05 + intensity * 0.05})`);
           grad.addColorStop(highlightPos, `rgba(154, 90, 53, ${0.2 + intensity * 0.4})`); // Copper
           grad.addColorStop(1, `rgba(22, 20, 18, ${0.05 + intensity * 0.05})`);
           ctx.shadowColor = `rgba(154, 90, 53, ${intensity * 0.5})`;
           ctx.shadowBlur = intensity * 15;
        } else {
           // Base ink with muted paper reflection
           grad.addColorStop(0, 'rgba(22, 20, 18, 0.05)');
           grad.addColorStop(highlightPos, 'rgba(22, 20, 18, 0.3)'); // stronger ink line
           grad.addColorStop(1, 'rgba(22, 20, 18, 0.05)');
           ctx.shadowBlur = 0;
        }

        ctx.strokeStyle = grad;
        ctx.stroke();
      }
    }

    function tick(t) {
      const mouse = mouseRef.current;
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx,
        dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);
      container.style.setProperty('--x', `${mouse.sx}px`);
      container.style.setProperty('--y', `${mouse.sy}px`);

      movePoints(t);
      drawLines();
      frameIdRef.current = requestAnimationFrame(tick);
    }

    function onResize() {
      setSize();
      setLines();
    }
    function onMouseMove(e) {
      updateMouse(e.clientX, e.clientY);
    }
    function onTouchMove(e) {
      const touch = e.touches[0];
      updateMouse(touch.clientX, touch.clientY);
    }
    function updateMouse(x, y) {
      const mouse = mouseRef.current,
        b = boundingRef.current;
      mouse.x = x - b.left;
      mouse.y = y - b.top;
      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    }

    function onClick(e) {
      const b = boundingRef.current;
      ripples.push({ 
        x: e.clientX - b.left, 
        y: e.clientY - b.top, 
        radius: 0, 
        life: 1 
      });
    }

    function onCustomRipple(e) {
      const b = boundingRef.current;
      ripples.push({ 
        x: e.detail.x - b.left, 
        y: e.detail.y - b.top, 
        radius: 0, 
        life: e.detail.intensity || 1 
      });
    }

    setSize();
    setLines();
    frameIdRef.current = requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('click', onClick);
    window.addEventListener('drift:ripple', onCustomRipple);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('drift:ripple', onCustomRipple);
      cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`waves ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor,
        pointerEvents: 'none',
        ...style
      }}
    >
      <canvas ref={canvasRef} className="waves-canvas" />
    </div>
  );
};

export default Waves;
