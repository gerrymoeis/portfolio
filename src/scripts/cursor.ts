/**
 * Custom Cursor with GSAP
 * Theme-aware cursor: Gradient Citrine (dark) / Gradient Fox (light)
 */

import gsap from 'gsap';

interface CursorOptions {
  cursorSize?: number;
}

interface CursorImages {
  dark: {
    default: string;
    pointer: string;
  };
  light: {
    default: string;
    pointer: string;
  };
}

export class CustomCursor {
  private cursor: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private isHovering = false;
  private options: Required<CursorOptions>;
  private styleElement: HTMLStyleElement | null = null;
  private currentTheme: 'light' | 'dark' = 'dark';
  
  private cursorImages: CursorImages = {
    dark: {
      default: '/gradient-citrine-cursor.png',
      pointer: '/gradient-citrine-pointer.png',
    },
    light: {
      default: '/gradient-fox-cursor.png',
      pointer: '/gradient-fox-pointer.png',
    },
  };

  constructor(options: CursorOptions = {}) {
    this.options = {
      cursorSize: options.cursorSize || 32,
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
   * Get cursor glow color based on theme
   */
  private getGlowColor(): string {
    return this.currentTheme === 'dark' 
      ? 'rgba(246, 224, 94, 0.6)' // Golden yellow for dark theme
      : 'rgba(255, 85, 0, 0.6)';   // Red-orange for light theme
  }

  /**
   * Initialize custom cursor
   */
  init(): void {
    if (typeof window === 'undefined') return;
    
    // Only enable on desktop devices
    if (this.isTouchDevice()) {
      return;
    }

    this.createCursorElement();
    this.attachEventListeners();
    this.hideDefaultCursor();
    this.attachFocusListeners();
    this.attachThemeListener();
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
   * Create cursor DOM element
   */
  private createCursorElement(): void {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    
    const glowColor = this.getGlowColor();
    this.cursor.style.cssText = `
      position: fixed;
      width: ${this.options.cursorSize}px;
      height: ${this.options.cursorSize}px;
      pointer-events: none;
      z-index: 9999;
      will-change: transform;
      left: 0;
      top: 0;
      opacity: 1;
      filter: drop-shadow(0 0 8px ${glowColor}) 
              drop-shadow(0 0 16px ${glowColor.replace('0.6', '0.4')})
              drop-shadow(0 0 24px ${glowColor.replace('0.6', '0.2')});
      transition: filter 0.3s ease;
    `;

    // Get theme-appropriate cursor images
    const images = this.cursorImages[this.currentTheme];

    // Default cursor image
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
    
    // Pointer cursor image (for hover)
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
    
    // Position cursor off-screen initially using GSAP
    gsap.set(this.cursor, {
      x: -100,
      y: -100,
    });
  }

  /**
   * Hide default cursor
   */
  private hideDefaultCursor(): void {
    // Don't create duplicate style elements
    if (this.styleElement && this.styleElement.parentNode) {
      return; // Style already applied
    }
    
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      * {
        cursor: none !important;
      }
      
      a, button, [role="button"], input, textarea, select {
        cursor: none !important;
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(this.styleElement);
  }

  /**
   * Show default cursor (restore system cursor)
   */
  private showSystemCursor(): void {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null; // Clear reference
    }
  }

  /**
   * Attach focus/blur listeners to handle browser dialogs and iframes
   */
  private attachFocusListeners(): void {
    // When page loses focus
    window.addEventListener('blur', () => {
      // Use setTimeout to let browser update document.activeElement
      // The blur event fires BEFORE activeElement is updated
      setTimeout(() => {
        // Check if blur was caused by iframe interaction
        const isIframeBlur = document.activeElement && 
                            document.activeElement.tagName === 'IFRAME';
        
        if (isIframeBlur) {
          // Iframe blur: Keep custom cursor visible
          // Do nothing - custom cursor stays active
        } else {
          // Dialog/other blur: Hide custom cursor, show system cursor
          if (this.cursor) {
            // Move cursor far off-screen AND hide it
            this.cursor.style.display = 'none';
            this.cursor.style.transform = 'translate(-9999px, -9999px)';
            this.cursor.style.visibility = 'hidden';
          }
          this.showSystemCursor();
        }
      }, 0);
    });

    // When page regains focus
    window.addEventListener('focus', () => {
      if (this.cursor) {
        this.cursor.style.display = 'block';
        this.cursor.style.transform = '';
        this.cursor.style.visibility = 'visible';
      }
      this.hideDefaultCursor();
    });

    // Fallback: visibility change detection (for tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.cursor) {
          this.cursor.style.display = 'none';
          this.cursor.style.transform = 'translate(-9999px, -9999px)';
          this.cursor.style.visibility = 'hidden';
        }
        this.showSystemCursor();
      } else {
        if (this.cursor) {
          this.cursor.style.display = 'block';
          this.cursor.style.transform = '';
          this.cursor.style.visibility = 'visible';
        }
        this.hideDefaultCursor();
      }
    });
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
   * Update cursor theme
   */
  private updateTheme(newTheme: 'light' | 'dark'): void {
    if (!this.cursor) return;
    
    this.currentTheme = newTheme;
    const images = this.cursorImages[newTheme];
    const glowColor = this.getGlowColor();
    
    // Update cursor images
    const defaultImg = this.cursor.querySelector('.cursor-default') as HTMLImageElement;
    const pointerImg = this.cursor.querySelector('.cursor-pointer') as HTMLImageElement;
    
    if (defaultImg) {
      defaultImg.src = images.default;
    }
    if (pointerImg) {
      pointerImg.src = images.pointer;
    }
    
    // Update glow effect
    this.cursor.style.filter = `
      drop-shadow(0 0 8px ${glowColor}) 
      drop-shadow(0 0 16px ${glowColor.replace('0.6', '0.4')})
      drop-shadow(0 0 24px ${glowColor.replace('0.6', '0.2')})
    `;
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.attachHoverListeners();
  }

  /**
   * Handle mouse move
   */
  private handleMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (this.cursor) {
      // Position cursor directly at mouse coordinates
      // The cursor hotspot should be at the top-left of the image
      gsap.to(this.cursor, {
        x: this.mouseX,
        y: this.mouseY,
        duration: 0.05, // Faster response for better alignment
        ease: 'power1.out',
      });
    }
  }

  /**
   * Attach hover listeners to interactive elements
   */
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

  /**
   * Show pointer cursor (on hover)
   */
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

  /**
   * Show default cursor
   */
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

  /**
   * Destroy cursor
   */
  destroy(): void {
    if (this.cursor) {
      this.cursor.remove();
    }
    this.showSystemCursor();
  }
}

/**
 * Initialize custom cursor
 */
export function initCustomCursor(): CustomCursor | null {
  if (typeof window === 'undefined') return null;
  
  const cursor = new CustomCursor({
    cursorSize: 32,
  });
  
  cursor.init();
  return cursor;
}
