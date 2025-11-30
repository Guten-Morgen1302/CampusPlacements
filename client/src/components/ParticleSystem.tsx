import { useEffect, useRef } from 'react';

export default function ParticleSystem() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 4 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Mouse tracking for interactive particles
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.01;
        const currentLeft = parseFloat(particle.style.left) || 0;
        const currentTop = parseFloat(particle.style.top) || 0;
        
        const targetX = mouseX * 100;
        const targetY = mouseY * 100;
        
        const newX = currentLeft + (targetX - currentLeft) * speed;
        const newY = currentTop + (targetY - currentTop) * speed;
        
        particle.style.left = newX + '%';
        particle.style.top = newY + '%';
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[-10]"
      data-testid="particle-system"
      style={{ zIndex: -10 }}
    />
  );
}
