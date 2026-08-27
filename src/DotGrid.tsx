import { useEffect, useRef } from 'react';

export default function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    let ripples: { x: number, y: number, radius: number, life: number }[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate coordinates relative to the canvas
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.push({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top, 
        radius: 0, 
        life: 1 
      });
    };

    const handleMouseLeave = () => {
      // Move interaction point far away when mouse leaves window
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const resize = () => {
      // High-DPI screen support for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (parent) {
         canvas.width = parent.clientWidth * dpr;
         canvas.height = parent.clientHeight * dpr;
         ctx.scale(dpr, dpr);
         canvas.style.width = `${parent.clientWidth}px`;
         canvas.style.height = `${parent.clientHeight}px`;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    resize();

    const draw = () => {
      // Clear canvas before next frame
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      
      // Interpolate mouse movement for smoothness (easing)
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += 18; // Expansion speed
        ripples[i].life -= 0.015; // Fade speed
        if (ripples[i].life <= 0) ripples.splice(i, 1);
      }

      // Grid configuration
      const spacing = 32;
      const baseRadius = 1.2;
      const maxRadius = 4;
      const interactionRadius = 200;
      
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.fillStyle = '#06b6d4'; // Tailwind cyan-500

      // Global parallax shift based on mouse relative to center of screen
      const centerX = width / 2;
      const centerY = height / 2;
      const parallaxX = mouse.x !== -1000 ? (mouse.x - centerX) * -0.03 : 0;
      const parallaxY = mouse.y !== -1000 ? (mouse.y - centerY) * -0.03 : 0;

      // Calculate starting offset to center the grid
      const offsetX = (width % spacing) / 2 + parallaxX;
      const offsetY = (height % spacing) / 2 + parallaxY;
      
      const time = Date.now() * 0.001; // For subtle wavy ambient depth

      // Expand loop bounds slightly to prevent popping at edges due to parallax
      for (let x = offsetX - spacing; x < width + spacing; x += spacing) {
        for (let y = offsetY - spacing; y < height + spacing; y += spacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let radius = baseRadius;
          let alpha = 0.25;
          let dotOffsetX = 0;
          let dotOffsetY = 0;
          
          // Ambient depth wave (makes the grid look like a gently undulating 3D plane)
          const ambientWave = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time);
          radius += ambientWave * 0.3;
          alpha += ambientWave * 0.05;

          if (distance < interactionRadius) {
            const factor = 1 - distance / interactionRadius; 
            const easeFactor = Math.sin(factor * Math.PI / 2); // Ease-out curve
            
            radius = baseRadius + easeFactor * (maxRadius - baseRadius) + (ambientWave * 0.3);
            alpha = 0.25 + easeFactor * 0.75; // Increases opacity when close

            // Subtle repulsion effect - dots push away slightly from cursor
            const repelStrength = easeFactor * 6; 
            const angle = Math.atan2(dy, dx);
            dotOffsetX = -Math.cos(angle) * repelStrength;
            dotOffsetY = -Math.sin(angle) * repelStrength;
            
            // Apply 3D drop shadow giving the illusion of lifting off the background
            ctx.shadowBlur = easeFactor * 12;
            ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
            // Cast shadow *away* from the mouse light source
            ctx.shadowOffsetX = -Math.cos(angle) * easeFactor * 8;
            ctx.shadowOffsetY = -Math.sin(angle) * easeFactor * 8;
          } else {
            // Reset shadow for inactive dots
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }

          // Apply click ripples (shockwave effect)
          for (const ripple of ripples) {
            const rdx = ripple.x - x;
            const rdy = ripple.y - y;
            const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
            
            const ringThickness = 60;
            const distToRing = Math.abs(rDist - ripple.radius);
            
            if (distToRing < ringThickness) {
              const force = (1 - distToRing / ringThickness) * ripple.life;
              const angle = Math.atan2(rdy, rdx);
              
              // Push dots outward from ripple center
              dotOffsetX += -Math.cos(angle) * force * 15; 
              dotOffsetY += -Math.sin(angle) * force * 15;
              
              // Temporarily increase size and opacity for the ripple
              radius += force * 2.5;
              alpha += force * 0.8;
            }
          }

          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.beginPath();
          ctx.arc(x + dotOffsetX, y + dotOffsetY, Math.max(0, radius), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      style={{ 
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
      }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
