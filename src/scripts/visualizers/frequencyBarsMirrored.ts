/**
 * Frequency Bars Visualizer - Mirrored from Center with Gradient Color Circulation
 * Ported from experiment_folder/visualizers/frequency-bars-mirrored.js
 * 
 * Features:
 * - Mirrored bars from center to both sides
 * - INVERSE height curve: Center tall (100%) → Edges short (20%) for natural look
 * - Smooth exponential falloff using Math.pow(position, 2.5)
 * - Mobile optimization: Reduced bar count for better visibility on small screens
 * - Minimum height (5%) prevents invisible bars at edges
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
  
  // Mobile optimization: Reduce bar count on small screens for better visibility
  const isMobile = canvas.width < 768;
  const displayBars = isMobile ? Math.floor(bufferLength * 0.6) : bufferLength;
  const step = bufferLength / displayBars;
  
  // Increase bar width multiplier to reduce gaps (2.5 → 3.5)
  // This makes bars wider and fills more space
  const barWidth = (centerX / displayBars) * 3.5; // Increased from 2.5 to 3.5
  const barGap = 0.5; // Small gap between bars (was 1)
  
  for (let i = 0; i < displayBars; i++) {
    // Get frequency data with step for mobile optimization
    const dataIndex = Math.floor(i * step);
    let barHeight = (dataArray[dataIndex] / 255) * canvas.height;
    
    // INVERSE CURVE: Center tall (100%) → Edges short (20%)
    // Natural exponential falloff for smooth, organic look
    const position = i / displayBars; // 0 to 1
    
    // Smooth exponential curve: 100% center → 20% edges
    // Power 2.5 gives natural, gradual falloff
    const heightMultiplier = 1.0 - Math.pow(position, 2.5) * 0.8;
    // i=0 (center): 1.0 - 0 = 1.0 (100%)
    // i=displayBars/2: 1.0 - 0.177 = 0.823 (82%)
    // i=displayBars: 1.0 - 0.8 = 0.2 (20%)
    
    barHeight = barHeight * heightMultiplier;
    
    // Minimum height for visibility (prevent invisible bars at edges)
    const minHeight = canvas.height * 0.05; // 5% minimum
    barHeight = Math.max(barHeight, minHeight);

    // Gradient Color: 60-degree gradient with VISIBLE color differences
    // Problem: (i / displayBars) creates tiny increments when displayBars is large
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
    const intensity = dataArray[dataIndex] / 255;
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
