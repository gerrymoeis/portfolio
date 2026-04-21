/**
 * Parallax Scroll Effects
 * 
 * Implements scroll-based parallax effects for project scenes.
 * Uses Intersection Observer to detect when scenes are in viewport.
 * Respects prefers-reduced-motion user preference.
 * Lazy loads on first scroll event for performance.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 15.2, 16.3
 */

interface ParallaxLayer {
  element: HTMLElement;
  speed: number;
}

interface ParallaxScene {
  element: HTMLElement;
  layers: ParallaxLayer[];
  isInViewport: boolean;
}

class ParallaxController {
  private scenes: ParallaxScene[] = [];
  private observer: IntersectionObserver | null = null;
  private isInitialized = false;
  private reducedMotion = false;
  private rafId: number | null = null;

  constructor() {
    // Check for reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for changes to reduced motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.resetAllTransforms();
      }
    });
  }

  /**
   * Initialize parallax effects
   * Finds all project scenes and hero sections, then sets up Intersection Observer
   */
  public init(): void {
    if (this.isInitialized || this.reducedMotion) {
      return;
    }

    // Find all project scenes (for listing page)
    const sceneElements = document.querySelectorAll<HTMLElement>('.project-scene');
    
    // Find all project hero sections (for detail page)
    const heroElements = document.querySelectorAll<HTMLElement>('.project-hero, .project-content');
    
    // Combine both types of parallax containers
    const allContainers = [...Array.from(sceneElements), ...Array.from(heroElements)];
    
    if (allContainers.length === 0) {
      return;
    }

    // Set up each container
    allContainers.forEach((containerElement) => {
      const layers: ParallaxLayer[] = [];
      
      // Find all parallax layers within this container
      const layerElements = containerElement.querySelectorAll<HTMLElement>('[data-parallax-speed]');
      
      layerElements.forEach((layerElement) => {
        const speedAttr = layerElement.getAttribute('data-parallax-speed');
        const speed = speedAttr ? parseFloat(speedAttr) : 1.0;
        
        layers.push({
          element: layerElement,
          speed: speed
        });
      });

      // Only add if there are layers to animate
      if (layers.length > 0) {
        this.scenes.push({
          element: containerElement,
          layers: layers,
          isInViewport: false
        });
      }
    });

    // Set up Intersection Observer
    this.setupIntersectionObserver();

    // Start scroll listener
    this.startScrollListener();

    this.isInitialized = true;
  }

  /**
   * Set up Intersection Observer to track which scenes are in viewport
   */
  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when at least 10% of scene is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const scene = this.scenes.find(s => s.element === entry.target);
        if (scene) {
          scene.isInViewport = entry.isIntersecting;
        }
      });
    }, options);

    // Observe all scenes
    this.scenes.forEach(scene => {
      if (this.observer) {
        this.observer.observe(scene.element);
      }
    });
  }

  /**
   * Start listening to scroll events
   */
  private startScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  /**
   * Handle scroll event with requestAnimationFrame for smooth performance
   */
  private handleScroll = (): void => {
    if (this.reducedMotion) {
      return;
    }

    // Cancel any pending animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Schedule update on next frame
    this.rafId = requestAnimationFrame(() => {
      this.updateParallax();
    });
  };

  /**
   * Update parallax transforms for all visible scenes
   */
  private updateParallax(): void {
    this.scenes.forEach(scene => {
      // Only update scenes that are in viewport
      if (!scene.isInViewport) {
        return;
      }

      // Get scene position relative to viewport
      const rect = scene.element.getBoundingClientRect();
      const sceneTop = rect.top;
      const sceneHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress through the scene
      // 0 = scene just entering viewport from bottom
      // 1 = scene just leaving viewport from top
      const scrollProgress = (viewportHeight - sceneTop) / (viewportHeight + sceneHeight);

      // Update each layer based on its speed
      scene.layers.forEach(layer => {
        // Calculate transform based on scroll progress and layer speed
        // Lower speed = slower movement (background layers)
        // Higher speed = faster movement (closer to normal scroll)
        const offset = this.calculateLayerOffset(scrollProgress, layer.speed, sceneHeight);
        
        // Apply transform
        this.applyTransform(layer.element, offset);
      });
    });
  }

  /**
   * Calculate the offset for a layer based on scroll progress and speed
   * 
   * @param scrollProgress - Progress through the scene (0 to 1)
   * @param speed - Layer speed multiplier (0 to 1)
   * @param sceneHeight - Height of the scene
   * @returns Offset in pixels
   */
  private calculateLayerOffset(scrollProgress: number, speed: number, sceneHeight: number): number {
    // Center the effect around the middle of the scene
    const centered = (scrollProgress - 0.5) * 2; // -1 to 1
    
    // Calculate offset based on speed
    // Speed of 1.0 means minimal movement (text layer)
    // Speed of 0.3 means maximum movement (background layer)
    const maxOffset = sceneHeight * 0.2; // Maximum 20% of scene height
    const speedFactor = 1 - speed; // Invert so lower speed = more movement
    
    return centered * maxOffset * speedFactor;
  }

  /**
   * Apply transform to an element
   * 
   * @param element - Element to transform
   * @param offset - Offset in pixels
   */
  private applyTransform(element: HTMLElement, offset: number): void {
    // Use translate3d for hardware acceleration
    element.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  /**
   * Reset all transforms (used when reduced motion is enabled)
   */
  private resetAllTransforms(): void {
    this.scenes.forEach(scene => {
      scene.layers.forEach(layer => {
        layer.element.style.transform = 'none';
      });
    });
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Remove scroll listener
    window.removeEventListener('scroll', this.handleScroll);

    // Cancel any pending animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Reset transforms
    this.resetAllTransforms();

    // Clear scenes
    this.scenes = [];
    this.isInitialized = false;
  }
}

// Singleton instance
let parallaxController: ParallaxController | null = null;

/**
 * Initialize parallax effects
 * Lazy loads on first scroll event
 */
export function initParallax(): void {
  // Don't initialize if reduced motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Create controller if it doesn't exist
  if (!parallaxController) {
    parallaxController = new ParallaxController();
  }

  // Initialize on first scroll event (lazy loading)
  let hasScrolled = false;
  
  const handleFirstScroll = () => {
    if (!hasScrolled && parallaxController) {
      hasScrolled = true;
      parallaxController.init();
      window.removeEventListener('scroll', handleFirstScroll);
    }
  };

  // Also initialize immediately if user has already scrolled
  if (window.scrollY > 0) {
    parallaxController.init();
  } else {
    // Wait for first scroll
    window.addEventListener('scroll', handleFirstScroll, { passive: true, once: true });
  }
}

/**
 * Destroy parallax effects
 */
export function destroyParallax(): void {
  if (parallaxController) {
    parallaxController.destroy();
    parallaxController = null;
  }
}
