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

    this.currentTheme = this.getTheme();
  }

  private getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  private getParticleColor(): string {
    return this.currentTheme === 'dark'
      ? 'rgba(246, 224, 94, 0.9)'
      : 'rgba(255, 85, 0, 0.9)';
  }

  init(): void {
    if (typeof window === 'undefined') return;
    if (this.isTouchDevice()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.attachEventListeners();
    this.attachThemeListener();
    this.isActive = true;
  }

  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches
    );
  }

  private attachEventListeners(): void {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  private attachThemeListener(): void {
    window.addEventListener('themechange', ((event: CustomEvent) => {
      this.updateTheme(event.detail.theme as 'light' | 'dark');
    }) as EventListener);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = this.getTheme();
          if (newTheme !== this.currentTheme) this.updateTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  private updateTheme(newTheme: 'light' | 'dark'): void {
    this.currentTheme = newTheme;
    const newColor = this.getParticleColor();

    this.particles.forEach((particle) => {
      particle.element.style.background = newColor;
      particle.element.style.boxShadow = `0 0 ${this.options.particleSize * 2}px ${newColor}`;
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (!this.isVisible) return;

    const now = Date.now();
    if (now - this.lastSpawnTime > this.options.spawnRate) {
      this.spawnParticle();
      this.lastSpawnTime = now;
    }
  }

  hide(): void {
    this.isVisible = false;
    this.particles.forEach((particle) => {
      particle.element.style.display = 'none';
    });
  }

  show(): void {
    this.isVisible = true;
    this.particles.forEach((particle) => {
      particle.element.style.display = 'block';
    });
  }

  private spawnParticle(): void {
    if (this.particles.length >= this.options.particleCount) {
      const oldest = this.particles.shift();
      if (oldest) oldest.element.remove();
    }

    const particle = document.createElement('div');
    particle.className = 'cursor-trail-particle';

    const color = this.getParticleColor();
    const size = this.options.particleSize;
    const lifetime = this.options.particleLifetime;

    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      will-change: transform, opacity;
      box-shadow: 0 0 ${size * 2}px ${color};
      left: 0;
      top: 0;
      transition: opacity ${lifetime}ms ease, transform ${lifetime}ms ease;
      opacity: 1;
      transform: translate(0, 0) scale(1);
    `;

    document.body.appendChild(particle);

    const cursorCenter = 16;
    const offsetX = this.mouseX + cursorCenter - size / 2;
    const offsetY = this.mouseY + cursorCenter - size / 2;

    const particleData: Particle = { element: particle };
    this.particles.push(particleData);

    particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1)`;

    // Trigger fade-out on next frame so the initial position renders first
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.3)`;
      particle.style.opacity = '0';
    });

    particle.addEventListener('transitionend', () => {
      this.removeParticle(particleData);
    }, { once: true });
  }

  private removeParticle(particle: Particle): void {
    const index = this.particles.indexOf(particle);
    if (index > -1) {
      this.particles.splice(index, 1);
      particle.element.remove();
    }
  }

  destroy(): void {
    this.isActive = false;
    this.particles.forEach((particle) => particle.element.remove());
    this.particles = [];
  }
}

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
