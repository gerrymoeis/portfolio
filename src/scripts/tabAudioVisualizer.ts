/**
 * Tab Audio Visualizer
 * Captures audio from browser tab and visualizes it in real-time
 * 
 * Uses:
 * - Screen Capture API (getDisplayMedia) for tab audio capture
 * - Web Audio API (AnalyserNode) for frequency analysis
 * - Canvas 2D for rendering mirrored frequency bars
 */

import { visualizeFrequencyBarsMirrored } from './visualizers/frequencyBarsMirrored';

export class TabAudioVisualizer {
  // Audio API properties
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private animationId: number | null = null;
  private isRunning: boolean = false;

  // Canvas elements
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private container: HTMLElement | null = null;

  // Status callback
  private onStatusChange: ((status: string, type: 'info' | 'success' | 'error') => void) | null = null;

  constructor() {
    this.init();
  }

  /**
   * Initialize visualizer
   */
  private init(): void {
    // Find canvas and container
    this.canvas = document.querySelector('[data-visualizer-canvas]') as HTMLCanvasElement;
    this.container = document.querySelector('[data-visualizer-container]') as HTMLElement;
    
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      
      // Add resize listener
      window.addEventListener('resize', () => this.resizeCanvas());
    }
  }

  /**
   * Resize canvas to match display size
   */
  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    // Set canvas size to match its display size
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  /**
   * Set status change callback
   */
  public setStatusCallback(callback: (status: string, type: 'info' | 'success' | 'error') => void): void {
    this.onStatusChange = callback;
  }

  /**
   * Update status
   */
  private updateStatus(message: string, type: 'info' | 'success' | 'error' = 'info'): void {
    if (this.onStatusChange) {
      this.onStatusChange(message, type);
    }
  }

  /**
   * Start audio capture and visualization
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      this.updateStatus('Visualizer is already running', 'info');
      return;
    }

    try {
      this.updateStatus('Requesting tab audio capture... Please select "This Tab" and check "Share audio"', 'info');

      // Request screen/tab capture with audio
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Required by spec (we'll ignore video data)
        audio: {
          echoCancellation: false,  // Don't filter out music
          noiseSuppression: false,  // Don't treat music as noise
          autoGainControl: false,   // Prevent volume changes
          sampleRate: 48000         // High quality
        },
        // Hints (browser may or may not respect these)
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        surfaceSwitching: 'include',
        systemAudio: 'include'
      } as any); // Type assertion for experimental properties

      // Check if audio track exists
      const audioTracks = this.stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio track found! Make sure to check "Share audio" in the browser prompt.');
      }

      this.updateStatus('Audio captured! Initializing visualizer...', 'success');

      // Create Web Audio API context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048; // Higher = more frequency detail
      this.analyser.smoothingTimeConstant = 0.8; // Smoothing (0-1)

      // Create source from captured stream
      this.source = this.audioContext.createMediaStreamSource(this.stream);

      // Connect: source → analyser
      // Note: We DON'T connect to destination to avoid feedback loop
      this.source.connect(this.analyser);

      // Update state
      this.isRunning = true;

      // Start visualization
      this.visualize();

      this.updateStatus('Visualizing! The visualizer is now synced with the audio.', 'success');

      // Handle stream end (user stops sharing)
      this.stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        this.updateStatus('Screen sharing stopped by user', 'error');
        this.stop();
      });

    } catch (error: any) {
      let errorMessage = 'Failed to start visualizer: ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Permission denied. Please allow screen sharing and make sure to check "Share audio".';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No audio source found. Make sure audio is playing.';
      } else {
        errorMessage += error.message;
      }
      
      this.updateStatus(errorMessage, 'error');
      this.stop();
    }
  }

  /**
   * Stop audio capture and visualization
   */
  public stop(): void {
    this.isRunning = false;

    // Stop animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Stop all tracks in the stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Clear canvas (transparent)
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Update container class
    if (this.container) {
      this.container.classList.add('audio-visualizer--paused');
      this.container.classList.remove('audio-visualizer--playing');
    }

    this.updateStatus('Visualizer stopped. Click "Start Visualizer" to begin again.', 'info');
  }

  /**
   * Visualization loop
   */
  private visualize(): void {
    if (!this.isRunning || !this.analyser || !this.canvas || !this.ctx) return;

    // Call mirrored visualizer function
    visualizeFrequencyBarsMirrored(this.ctx, this.canvas, this.analyser);

    // Update container class
    if (this.container) {
      this.container.classList.add('audio-visualizer--playing');
      this.container.classList.remove('audio-visualizer--paused');
    }

    // Continue animation loop
    this.animationId = requestAnimationFrame(() => this.visualize());
  }

  /**
   * Check if visualizer is running
   */
  public isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stop();
    
    // Remove resize listener
    window.removeEventListener('resize', () => this.resizeCanvas());
    
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.onStatusChange = null;
  }
}

// Export singleton instance
let visualizerInstance: TabAudioVisualizer | null = null;

export function getTabAudioVisualizer(): TabAudioVisualizer {
  if (!visualizerInstance) {
    visualizerInstance = new TabAudioVisualizer();
  }
  return visualizerInstance;
}
