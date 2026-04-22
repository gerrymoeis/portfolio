/**
 * Custom Cursor with GSAP
 * Gradient Citrine cursor with glow effect and proper hover states
 */

import gsap from 'gsap';

interface CursorOptions {
  cursorSize?: number;
}

export class CustomCursor {
  private cursor: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private isHovering = false;
  private options: Required<CursorOptions>;
  private styleElement: HTMLStyleElement | null = null;

  constructor(options: CursorOptions = {}) {
    this.options = {
      cursorSize: options.cursorSize || 32,
    };
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
      filter: drop-shadow(0 0 8px rgba(246, 224, 94, 0.6)) 
              drop-shadow(0 0 16px rgba(246, 224, 94, 0.4))
              drop-shadow(0 0 24px rgba(246, 224, 94, 0.2));
    `;

    // Default cursor image
    const cursorImg = document.createElement('img');
    cursorImg.src = '/gradient-citrine-cursor.png';
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
    `;
    
    // Pointer cursor image (for hover)
    const pointerImg = document.createElement('img');
    pointerImg.src = '/gradient-citrine-pointer.png';
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
    }
  }

  /**
   * Attach focus/blur listeners to handle browser dialogs
   */
  private attachFocusListeners(): void {
    let lastMouseTarget: EventTarget | null = null;

    // Track the last element the mouse was over
    document.addEventListener('mouseover', (e) => {
      lastMouseTarget = e.target;
    }, true);

    // When page loses focus
    window.addEventListener('blur', () => {
      // Check if the last mouse target was an iframe
      const isIframeInteraction = lastMouseTarget instanceof HTMLElement && 
                                   (lastMouseTarget.tagName === 'IFRAME' || 
                                    lastMouseTarget.closest('iframe'));
      
      // Only hide custom cursor for non-iframe blur events (e.g., browser dialogs)
      if (!isIframeInteraction) {
        // Completely remove custom cursor from DOM
        if (this.cursor && this.cursor.parentNode) {
          this.cursor.parentNode.removeChild(this.cursor);
        }
        this.showSystemCursor();
      }
    });

    // When page regains focus
    window.addEventListener('focus', () => {
      // Restore custom cursor only if it was removed (not just hidden)
      if (!this.cursor || !this.cursor.parentNode) {
        this.createCursorElement();
      }
      this.hideDefaultCursor();
    });

    // Fallback: visibility change detection (for tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Completely remove custom cursor from DOM
        if (this.cursor && this.cursor.parentNode) {
          this.cursor.parentNode.removeChild(this.cursor);
        }
        this.showSystemCursor();
      } else {
        // Restore custom cursor only if it was removed
        if (!this.cursor || !this.cursor.parentNode) {
          this.createCursorElement();
        }
        this.hideDefaultCursor();
      }
    });
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
