/**
 * Frequency Bars Visualizer - Mirrored from Center with Gradient Color Circulation
 * Ported from experiment_folder/visualizers/frequency-bars-mirrored.js
 * 
 * Features:
 * - Mirrored bars from center to both sides
 * - Gradient color from center to edges (center=red, edges=green, etc.)
 * - Warm jewel tone style: consistent saturation (75-85%) and lightness (55-70%) across all hues
 * - Continuous hue rotation naturally cycles through full spectrum
 * - Animation flows from center outward to both sides
 */

// Global base hue for gradient animation
let globalHueOffset = 0;

export function visualizeFrequencyBarsMirrored(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode
): void {
  // Get frequency data
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  // Clear canvas with fade effect (transparent background)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Continuously shift the base hue of the gradient (animation)
  globalHueOffset -= 0.15;
  if (globalHueOffset >= 360) {
    globalHueOffset = 0;
  }

  // SIMPLE: Use same calculation as left-to-right but mirror from center
  const centerX = canvas.width / 2;
  // Increase bar width multiplier to reduce gaps (2.5 → 3.5)
  // This makes bars wider and fills more space
  const barWidth = (centerX / bufferLength) * 3.5; // Increased from 2.5 to 3.5
  const barGap = 0.5; // Small gap between bars (was 1)
  
  for (let i = 0; i < bufferLength; i++) {
    let barHeight = (dataArray[i] / 255) * canvas.height;
    
    // Apply gentle downhill curve at edges for natural look
    const position = i / bufferLength; // 0 to 1
    // Create a curve that's 100% in center, gradually reduces to ~70% at edges
    const edgeCurve = 1 - (position * position * 0.3); // Quadratic curve
    barHeight = barHeight * edgeCurve;

    // Gradient Color: 60-degree gradient with VISIBLE color differences
    // Problem: (i / bufferLength) creates tiny increments when bufferLength is large
    // Solution: Use direct multiplier but limit total spread to 60 degrees
    
    // Base hue shifts continuously
    const baseHue = globalHueOffset;
    
    // Position-based hue offset for 60° gradient
    // Use direct multiplier for visible gradient, but smaller than before
    // 0.5 degrees per bar gives visible gradient without going through full spectrum
    const gradientHueOffset = i * 0.5; // 0.5° per bar
    // This gives: bar 0 = 0°, bar 120 = 60° (red to yellow)
    
    // Current hue for this bar: base hue + gradient offset
    const currentHue = (baseHue + gradientHueOffset) % 360;
    
    // Audio intensity affects saturation and lightness
    // Adjusted for warm jewel tone style (matching website theme)
    // Jewel tones: Saturation 73-83%, Lightness 56-76%
    const intensity = dataArray[i] / 255;
    const saturation = 75 + (intensity * 10); // 75-85% (jewel tone range)
    const lightness = 55 + (intensity * 15);  // 55-70% (jewel tone range)

    // Simple HSL color (full spectrum like old code)
    ctx.fillStyle = `hsl(${currentHue}, ${saturation}%, ${lightness}%)`;

    // Draw right side (center to right edge)
    // Reduced gap from 1 to 0.5
    const xRight = centerX + (i * (barWidth + barGap));
    ctx.fillRect(
      xRight,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );

    // Draw left side (mirror - center to left edge)
    const xLeft = centerX - (i * (barWidth + barGap)) - barWidth;
    ctx.fillRect(
      xLeft,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );
  }
}
