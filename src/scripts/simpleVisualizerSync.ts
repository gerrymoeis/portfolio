/**
 * Simple Spotify Visualizer Sync
 * Listens to Spotify iframe API playback events and syncs visualizer
 */

class SimpleVisualizerSync {
  private visualizer: any = null;
  private isPlaying = false;
  
  constructor() {
    this.init();
  }
  
  private init() {
    // Wait for visualizer to be ready
    this.waitForVisualizer();
    
    // Listen for Spotify playback events
    this.setupSpotifyListeners();
    
    // Listen for carousel navigation
    this.setupNavigationListener();
  }
  
  private waitForVisualizer() {
    const checkVisualizer = () => {
      this.visualizer = (window as any).audioVisualizer;
      if (!this.visualizer) {
        setTimeout(checkVisualizer, 500);
      }
    };
    checkVisualizer();
  }
  
  private setupSpotifyListeners() {
    // Listen for Spotify playback state changes
    document.addEventListener('spotify:playback', (event: Event) => {
      const customEvent = event as CustomEvent;
      const { isPlaying } = customEvent.detail;
      
      if (isPlaying) {
        this.startVisualizer();
      } else {
        this.stopVisualizer();
      }
    });
    
    // Listen for when Spotify controller is ready
    document.addEventListener('spotify:ready', () => {
      // Spotify controller ready
    });
  }
  
  private setupNavigationListener() {
    // Stop visualizer when navigating playlists
    document.addEventListener('carousel:navigate', () => {
      this.stopVisualizer();
    });
    
    document.addEventListener('pagination:navigate', () => {
      this.stopVisualizer();
    });
  }
  
  private startVisualizer() {
    if (!this.visualizer) {
      return;
    }
    
    this.isPlaying = true;
    this.visualizer.play();
  }
  
  private stopVisualizer() {
    if (!this.visualizer) {
      return;
    }
    
    this.isPlaying = false;
    this.visualizer.pause();
  }
  
  // Public methods
  public play() {
    this.startVisualizer();
  }
  
  public pause() {
    this.stopVisualizer();
  }
}

// Initialize
const sync = new SimpleVisualizerSync();

// Global access
if (typeof window !== 'undefined') {
  (window as any).visualizerSync = sync;
}

export default sync;