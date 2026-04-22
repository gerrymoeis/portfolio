/**
 * Frequency Bars Visualizer - Mirrored from Center
 * Ported from experiment_folder/visualizers/frequency-bars-mirrored.js
 * 
 * SIMPLE: Take left-to-right and mirror it from center
 * With natural downhill curve at edges
 */

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

  // SIMPLE: Use same calculation as left-to-right but mirror from center
  const centerX = canvas.width / 2;
  const barWidth = (centerX / bufferLength) * 2.5; // Half width divided by frequency bins
  
  for (let i = 0; i < bufferLength; i++) {
    let barHeight = (dataArray[i] / 255) * canvas.height;
    
    // Apply gentle downhill curve at edges for natural look
    const position = i / bufferLength; // 0 to 1
    // Create a curve that's 100% in center, gradually reduces to ~70% at edges
    const edgeCurve = 1 - (position * position * 0.3); // Quadratic curve
    barHeight = barHeight * edgeCurve;

    // Color gradient based on frequency
    const hue = (i / bufferLength) * 360;
    const saturation = 100;
    const lightness = 40 + (dataArray[i] / 255) * 30;

    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Draw right side (center to right edge)
    const xRight = centerX + (i * (barWidth + 1));
    ctx.fillRect(
      xRight,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );

    // Draw left side (mirror - center to left edge)
    const xLeft = centerX - (i * (barWidth + 1)) - barWidth;
    ctx.fillRect(
      xLeft,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );
  }
}
