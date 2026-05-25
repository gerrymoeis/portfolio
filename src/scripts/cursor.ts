interface CursorImages {
  dark: { default: string; pointer: string };
  light: { default: string; pointer: string };
}

export class CustomCursor {
  private cursor: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private isHovering = false;
  private styleElement: HTMLStyleElement | null = null;
  private currentTheme: 'light' | 'dark' = 'dark';

  private cursorImages: CursorImages = {
    dark: {
      default: '/gradient-citrine-cursor.webp',
      pointer: '/gradient-citrine-pointer.webp',
    },
    light: {
      default: '/gradient-fox-cursor.webp',
      pointer: '/gradient-fox-pointer.webp',
    },
  };

  constructor() {
    this.currentTheme = this.getTheme();
  }

  private getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  private getGlowColor(): string {
    return this.currentTheme === 'dark'
      ? 'rgba(246, 224, 94, 0.6)'
      : 'rgba(255, 85, 0, 0.6)';
  }

  init(): void {
    if (typeof window === 'undefined') return;
    if (this.isTouchDevice()) return;

    this.createCursorElement();
    this.preloadImages();
    this.attachEventListeners();
    this.hideDefaultCursor();
    this.attachFocusListeners();
    this.attachThemeListener();
  }

  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none)').matches
    );
  }

  private preloadImages(): void {
    const { dark, light } = this.cursorImages;
    [dark.default, dark.pointer, light.default, light.pointer].forEach(src => {
      const img = new Image();
      img.src = src;
      img.decode().catch(() => {});
    });
  }

  private createCursorElement(): void {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';

    const glowColor = this.getGlowColor();
    this.cursor.style.cssText = `
      position: fixed;
      width: 32px;
      height: 32px;
      pointer-events: none;
      z-index: 9999;
      will-change: transform;
      left: 0;
      top: 0;
      opacity: 1;
      filter: drop-shadow(0 0 8px ${glowColor});
      transition: transform 0.05s linear, filter 0.3s ease;
    `;

    const images = this.cursorImages[this.currentTheme];

    const cursorImg = document.createElement('img');
    cursorImg.src = images.default;
    cursorImg.alt = '';
    cursorImg.className = 'cursor-default';
    cursorImg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      transition: opacity 0.3s ease;
    `;

    const pointerImg = document.createElement('img');
    pointerImg.src = images.pointer;
    pointerImg.alt = '';
    pointerImg.className = 'cursor-pointer';
    pointerImg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      transition: opacity 0.3s ease;
    `;

    this.cursor.appendChild(cursorImg);
    this.cursor.appendChild(pointerImg);
    document.body.appendChild(this.cursor);

    this.cursor.style.transform = 'translate(-100px, -100px)';
  }

  private hideDefaultCursor(): void {
    if (this.styleElement && this.styleElement.parentNode) return;

    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      * { cursor: none !important; }
      a, button, [role="button"], input, textarea, select {
        cursor: none !important;
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(this.styleElement);
  }

  private showSystemCursor(): void {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }

  private attachFocusListeners(): void {
    window.addEventListener('blur', () => {
      setTimeout(() => {
        const isIframeBlur = document.activeElement && document.activeElement.tagName === 'IFRAME';
        if (!isIframeBlur && this.cursor) {
          this.cursor.style.display = 'none';
          this.cursor.style.visibility = 'hidden';
        }
      }, 0);
    });

    window.addEventListener('focus', () => {
      if (this.cursor) {
        this.cursor.style.display = 'block';
        this.cursor.style.visibility = 'visible';
      }
      this.hideDefaultCursor();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.cursor) {
          this.cursor.style.display = 'none';
          this.cursor.style.visibility = 'hidden';
        }
        this.showSystemCursor();
      } else {
        if (this.cursor) {
          this.cursor.style.display = 'block';
          this.cursor.style.visibility = 'visible';
        }
        this.hideDefaultCursor();
      }
    });
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
    if (!this.cursor) return;
    this.currentTheme = newTheme;
    const images = this.cursorImages[newTheme];
    const glowColor = this.getGlowColor();

    const defaultImg = this.cursor.querySelector('.cursor-default') as HTMLImageElement;
    const pointerImg = this.cursor.querySelector('.cursor-pointer') as HTMLImageElement;
    if (defaultImg) defaultImg.src = images.default;
    if (pointerImg) pointerImg.src = images.pointer;

    this.cursor.style.filter = `drop-shadow(0 0 8px ${glowColor})`;
  }

  private attachEventListeners(): void {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.attachHoverListeners();
  }

  private handleMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (this.cursor) {
      this.cursor.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
    }
  }

  private attachHoverListeners(): void {
    const interactiveElements = 'a, button, [role="button"], input, textarea, select, [onclick]';

    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches(interactiveElements) || target.closest(interactiveElements)) {
        this.showPointer();
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches(interactiveElements) || target.closest(interactiveElements)) {
        this.showDefault();
      }
    });
  }

  private showPointer(): void {
    if (!this.cursor) return;
    const defaultImg = this.cursor.querySelector('.cursor-default') as HTMLElement;
    const pointerImg = this.cursor.querySelector('.cursor-pointer') as HTMLElement;
    if (defaultImg && pointerImg) {
      defaultImg.style.display = 'none';
      pointerImg.style.display = 'block';
    }
    this.isHovering = true;
  }

  private showDefault(): void {
    if (!this.cursor) return;
    const defaultImg = this.cursor.querySelector('.cursor-default') as HTMLElement;
    const pointerImg = this.cursor.querySelector('.cursor-pointer') as HTMLElement;
    if (defaultImg && pointerImg) {
      defaultImg.style.display = 'block';
      pointerImg.style.display = 'none';
    }
    this.isHovering = false;
  }

  destroy(): void {
    if (this.cursor) this.cursor.remove();
    this.showSystemCursor();
  }
}

export function initCustomCursor(): CustomCursor | null {
  if (typeof window === 'undefined') return null;
  const cursor = new CustomCursor();
  cursor.init();
  return cursor;
}
