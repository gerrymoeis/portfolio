/**
 * Tab Audio Visualizer
 * Captures audio from browser tab and visualizes it in real-time
 * Adapted from experiment_folder/visualizer-main.js
 * 
 * Uses:
 * - Screen Capture API (getDisplayMedia) for tab audio capture
 * - Web Audio API (AnalyserNode) for frequency analysis
 * - Existing AudioVisualizer bars for rendering
 */

export class TabAudioVisualizer {
  // Audio API properties
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private animationId: number | null = null;
  private isRunning: boolean = false;

  // Visualizer elements
  private bars: NodeListOf<HTMLElement> | null = null;
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
    // Find visualizer container and bars
    this.container = document.querySelector('[data-visualizer-container]') as HTMLElement;
    if (this.container) {
      this.bars = this.container.querySelectorAll('[data-bar-id]');
    }
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
    console.log(`[TabAudioVisualizer] ${type.toUpperCase()}: ${message}`);
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

      console.log('✅ Tab Audio Visualizer started successfully');
      console.log('Audio tracks:', audioTracks.length);
      console.log('Sample rate:', this.audioContext.sampleRate);

    } catch (error: any) {
      console.error('❌ Error starting visualizer:', error);
      
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
        console.log('Stopped track:', track.kind);
      });
      this.stream = null;
    }

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Reset bars to 0
    if (this.bars) {
      this.bars.forEach((bar) => {
        const barElement = bar.querySelector('.audio-visualizer__bar-fill') as HTMLElement;
        if (barElement) {
          barElement.style.height = '0%';
          barElement.style.opacity = '0.4';
        }
      });
    }

    // Update container class
    if (this.container) {
      this.container.classList.add('audio-visualizer--paused');
      this.container.classList.remove('audio-visualizer--playing');
    }

    this.updateStatus('Visualizer stopped. Click "Start Visualizer" to begin again.', 'info');

    console.log('⏹️ Tab Audio Visualizer stopped');
  }

  /**
   * Visualization loop
   */
  private visualize(): void {
    if (!this.isRunning || !this.analyser || !this.bars) return;

    // Get frequency data
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate how many frequency bins to use per bar
    const barCount = this.bars.length;
    const step = Math.floor(bufferLength / barCount);

    // Debug: Log frequency data every 60 frames (~1 second)
    if (Math.random() < 0.016) {
      const maxValue = Math.max(...Array.from(dataArray));
      const avgValue = Array.from(dataArray).reduce((a, b) => a + b, 0) / dataArray.length;
      console.log(`[Visualizer Debug] Max: ${maxValue}, Avg: ${avgValue.toFixed(1)}, Bars: ${barCount}`);
    }

    // Update each bar based on frequency data
    this.bars.forEach((bar, index) => {
      const barElement = bar.querySelector('.audio-visualizer__bar-fill') as HTMLElement;
      if (!barElement) return;

      // Get frequency data for this bar (average multiple bins)
      const startIndex = index * step;
      const endIndex = Math.min(startIndex + step, bufferLength);
      let sum = 0;
      let count = 0;

      for (let i = startIndex; i < endIndex; i++) {
        sum += dataArray[i];
        count++;
      }

      const average = count > 0 ? sum / count : 0;
      
      // Normalize to 0-1 range (0-255 -> 0-1)
      const normalizedValue = average / 255;

      // AGGRESSIVE AMPLIFICATION for visibility
      // Apply power curve to boost mid-range values significantly
      // Then multiply by 3.5 for strong visibility
      const amplified = Math.pow(normalizedValue, 0.7) * 3.5;
      const clampedValue = Math.min(amplified, 1.0);

      // Get max height from CSS variable (default 85%)
      const maxHeight = parseFloat(getComputedStyle(bar).getPropertyValue('--max-height')) || 85;

      // Calculate bar height - direct mapping with minimum threshold
      const barHeight = clampedValue > 0.02 
        ? Math.max(clampedValue * maxHeight, 3) // Minimum 3% when audio detected
        : 0;

      // Update bar directly (no transition needed, handled by requestAnimationFrame)
      barElement.style.height = `${barHeight}%`;

      // Update opacity for better visibility
      const opacity = 0.85 + (clampedValue * 0.15); // 0.85 to 1.0
      barElement.style.opacity = opacity.toString();
    });

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
    this.bars = null;
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
