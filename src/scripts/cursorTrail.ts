/**
 * Cursor Particle Trail Effect
 * Theme-aware particle trail: Golden yellow (dark) / Red-orange (light)
 */

import gsap from 'gsap';

interface Particle {
  element: HTMLElement;
  x: number;
  y: number;
  life: number;
}

interface TrailOptions {
  particleCount?: number;
  particleSize?: number;
  particleLifetime?: number;
  spawnRate?: number;
}

export class CursorTrail {
  private particles: Particle[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private lastSpawnTime = 0;
  private animationFrame: number | null = null;
  private options: Required<Omit<TrailOptions, 'color'>>;
  private isActive = false;
  private isVisible = true;
  private currentTheme: 'light' | 'dark' = 'dark';

  constructor(options: TrailOptions = {}) {
    this.options = {
      particleCount: options.particleCount || 50,
      particleSize: options.particleSize || 10,
      particleLifetime: options.particleLifetime || 1000, // ms
      spawnRate: options.spawnRate || 30, // ms between spawns
    };
    
    // Detect initial theme
    this.currentTheme = this.getTheme();
  }

  /**
   * Get current theme from document
   */
  private getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  /**
   * Get particle color based on theme
   */
  private getParticleColor(): string {
    return this.currentTheme === 'dark'
      ? 'rgba(246, 224, 94, 0.9)' // Golden yellow for dark theme
      : 'rgba(255, 85, 0, 0.9)';   // Red-orange for light theme
  }

  /**
   * Initialize particle trail
   */
  init(): void {
    if (typeof window === 'undefined') return;
    
    // Only enable on desktop devices
    if (this.isTouchDevice()) {
      console.log('Cursor trail disabled: touch device detected');
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('Cursor trail disabled: reduced motion preference');
      return;
    }

    this.attachEventListeners();
    this.attachThemeListener();
    this.startAnimation();
    this.isActive = true;
    
    console.log('Cursor trail active');
  }

  /**
   * Check if device is touch-enabled
   */
  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches
    );
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  /**
   * Attach theme change listener
   */
  private attachThemeListener(): void {
    // Listen for theme changes
    window.addEventListener('themechange', ((event: CustomEvent) => {
      const newTheme = event.detail.theme as 'light' | 'dark';
      this.updateTheme(newTheme);
    }) as EventListener);
    
    // Also listen for data-theme attribute changes (fallback)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = this.getTheme();
          if (newTheme !== this.currentTheme) {
            this.updateTheme(newTheme);
          }
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  /**
   * Update trail theme
   */
  private updateTheme(newTheme: 'light' | 'dark'): void {
    this.currentTheme = newTheme;
    const newColor = this.getParticleColor();
    
    // Update existing particles with new color
    this.particles.forEach((particle) => {
      particle.element.style.background = newColor;
      
      // Update box-shadow with new color
      particle.element.style.boxShadow = `
        0 0 ${this.options.particleSize * 1.5}px ${newColor},
        0 0 ${this.options.particleSize * 3}px ${newColor.replace('0.9', '0.6')},
        0 0 ${this.options.particleSize * 5}px ${newColor.replace('0.9', '0.3')}
      `;
    });
  }

  /**
   * Handle mouse move
   */
  private handleMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    // Only spawn particles if trail is visible
    if (!this.isVisible) return;

    const now = Date.now();
    if (now - this.lastSpawnTime > this.options.spawnRate) {
      this.spawnParticle();
      this.lastSpawnTime = now;
    }
  }

  /**
   * Hide trail (for dialogs)
   */
  hide(): void {
    this.isVisible = false;
    // Hide all existing particles
    this.particles.forEach((particle) => {
      particle.element.style.display = 'none';
    });
  }

  /**
   * Show trail
   */
  show(): void {
    this.isVisible = true;
    // Show all existing particles
    this.particles.forEach((particle) => {
      particle.element.style.display = 'block';
    });
  }

  /**
   * Spawn a new particle
   */
  private spawnParticle(): void {
    // Limit particle count
    if (this.particles.length >= this.options.particleCount) {
      const oldest = this.particles.shift();
      if (oldest) {
        oldest.element.remove();
      }
    }

    const particle = document.createElement('div');
    particle.className = 'cursor-trail-particle';
    
    const color = this.getParticleColor();
    
    // Minimalist glow effect - matches cursor shape
    particle.style.cssText = `
      position: fixed;
      width: ${this.options.particleSize}px;
      height: ${this.options.particleSize}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      will-change: transform, opacity;
      box-shadow: 
        0 0 ${this.options.particleSize * 1.5}px ${color},
        0 0 ${this.options.particleSize * 3}px ${color.replace('0.9', '0.6')},
        0 0 ${this.options.particleSize * 5}px ${color.replace('0.9', '0.3')};
      left: 0;
      top: 0;
      transition: background 0.3s ease, box-shadow 0.3s ease;
    `;

    document.body.appendChild(particle);

    // Spawn at cursor center (16px is half of 32px cursor)
    const cursorCenter = 16;
    const spawnX = this.mouseX + cursorCenter;
    const spawnY = this.mouseY + cursorCenter;

    const particleData: Particle = {
      element: particle,
      x: spawnX,
      y: spawnY,
      life: 1,
    };

    this.particles.push(particleData);

    // Position particle at spawn coordinates (centered)
    const offsetX = spawnX - this.options.particleSize / 2;
    const offsetY = spawnY - this.options.particleSize / 2;

    // Animate particle with GSAP - fade out with lighting effect
    gsap.set(particle, {
      x: offsetX,
      y: offsetY,
      scale: 1,
      opacity: 1,
    });

    gsap.to(particle, {
      scale: 0.3, // Shrink slightly instead of disappearing completely
      opacity: 0,
      duration: this.options.particleLifetime / 1000,
      ease: 'power2.out',
      onComplete: () => {
        this.removeParticle(particleData);
      },
    });
  }

  /**
   * Remove a particle
   */
  private removeParticle(particle: Particle): void {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
      particle.element.remove();
    }
  }

  /**
   * Start animation loop
   */
  private startAnimation(): void {
    const animate = () => {
      if (!this.isActive) return;
      
      // Update particles (if needed for physics)
      this.particles.forEach((particle) => {
        particle.life -= 0.016; // Approximate frame time
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Destroy trail
   */
  destroy(): void {
    this.isActive = false;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.particles.forEach((particle) => {
      particle.element.remove();
    });
    
    this.particles = [];
  }
}

/**
 * Initialize cursor trail
 */
export function initCursorTrail(): CursorTrail | null {
  if (typeof window === 'undefined') return null;
  
  const trail = new CursorTrail({
    particleCount: 20,
    particleSize: 8,
    particleLifetime: 800,
    spawnRate: 20,
  });
  
  trail.init();
  
  // Debug log
  if (import.meta.env.DEV) {
    console.log('Cursor trail initialized:', trail);
  }
  
  return trail;
}
