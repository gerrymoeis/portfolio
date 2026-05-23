/**
 * Cursor Particle Trail Effect
 * Theme-aware particle trail: Golden yellow (dark) / Red-orange (light)
 */

import gsap from 'gsap';

interface Particle {
  element: HTMLElement;
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
  private options: Required<Omit<TrailOptions, 'color'>>;
  private isActive = false;
  private isVisible = true;
  private currentTheme: 'light' | 'dark' = 'dark';

  constructor(options: TrailOptions = {}) {
    this.options = {
      particleCount: options.particleCount || 8,
      particleSize: options.particleSize || 6,
      particleLifetime: options.particleLifetime || 600,
      spawnRate: options.spawnRate || 40,
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
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.attachEventListeners();
    this.attachThemeListener();
    this.isActive = true;
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
      
      particle.element.style.boxShadow = `0 0 ${this.options.particleSize * 2}px ${newColor}`;
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
      box-shadow: 0 0 ${this.options.particleSize * 2}px ${color};
      left: 0;
      top: 0;
      transition: background 0.3s ease, box-shadow 0.3s ease;
    `;

    document.body.appendChild(particle);

    // Spawn at cursor center (16px is half of 32px cursor)
    const cursorCenter = 16;
    const spawnX = this.mouseX + cursorCenter;
    const spawnY = this.mouseY + cursorCenter;

    const particleData: Particle = { element: particle };

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
   * Destroy trail
   */
  destroy(): void {
    this.isActive = false;

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
    particleCount: 8,
    particleSize: 6,
    particleLifetime: 600,
    spawnRate: 40,
  });
  
  trail.init();
  
  return trail;
}
