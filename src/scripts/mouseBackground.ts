/**
 * Mouse-reactive background for home page
 * Tracks mouse position and applies subtle parallax transforms to background layers
 * Respects prefers-reduced-motion user preference
 */

interface MousePosition {
  x: number;
  y: number;
}

interface BackgroundLayer {
  element: HTMLElement;
  speed: number;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Calculate transform values based on mouse position
 * @param mouseX - Mouse X position (0-1 normalized)
 * @param mouseY - Mouse Y position (0-1 normalized)
 * @param speed - Layer speed multiplier
 * @returns Transform string for CSS
 */
export function calculateTransform(mouseX: number, mouseY: number, speed: number): string {
  // Calculate offset from center (range: -0.5 to 0.5)
  const offsetX = (mouseX - 0.5) * speed;
  const offsetY = (mouseY - 0.5) * speed;
  
  // Convert to pixel values (subtle movement)
  const translateX = offsetX * 40; // Max 20px movement in each direction
  const translateY = offsetY * 40;
  
  return `translate(${translateX}px, ${translateY}px)`;
}

/**
 * Initialize mouse-reactive background
 * Sets up event listeners and applies transforms to background layers
 */
export function initMouseBackground(): () => void {
  // Check for reduced motion preference
  if (prefersReducedMotion()) {
    return () => {}; // Return no-op cleanup function
  }

  // Find all background layers
  const layers: BackgroundLayer[] = [];
  const layerElements = document.querySelectorAll<HTMLElement>('[data-mouse-layer]');
  
  layerElements.forEach((element) => {
    const speed = parseFloat(element.dataset.mouseSpeed || '1');
    layers.push({ element, speed });
  });

  if (layers.length === 0) {
    console.warn('No mouse background layers found');
    return () => {};
  }

  // Track current mouse position (normalized 0-1)
  let currentMouse: MousePosition = { x: 0.5, y: 0.5 };
  let rafId: number | null = null;

  /**
   * Update layer transforms using requestAnimationFrame
   */
  function updateLayers() {
    layers.forEach(({ element, speed }) => {
      const transform = calculateTransform(currentMouse.x, currentMouse.y, speed);
      element.style.transform = transform;
    });
    rafId = null;
  }

  /**
   * Handle mouse move events
   */
  function handleMouseMove(event: MouseEvent) {
    // Normalize mouse position to 0-1 range
    currentMouse.x = event.clientX / window.innerWidth;
    currentMouse.y = event.clientY / window.innerHeight;

    // Use requestAnimationFrame to throttle updates
    if (rafId === null) {
      rafId = requestAnimationFrame(updateLayers);
    }
  }

  /**
   * Handle reduced motion preference changes
   */
  function handleMotionPreferenceChange(event: MediaQueryListEvent) {
    if (event.matches) {
      // User now prefers reduced motion - reset transforms
      cleanup();
    }
  }

  // Set up event listeners
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', handleMotionPreferenceChange);

  // Cleanup function
  function cleanup() {
    window.removeEventListener('mousemove', handleMouseMove);
    motionQuery.removeEventListener('change', handleMotionPreferenceChange);
    
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Reset all layer transforms
    layers.forEach(({ element }) => {
      element.style.transform = '';
    });
  }

  return cleanup;
}
