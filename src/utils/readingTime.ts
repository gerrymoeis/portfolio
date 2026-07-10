/**
 * Reading Time Calculator
 * Estimates reading time based on word count
 * Average reading speed: 200 words per minute
 */

/**
 * Calculate reading time from text content
 * @param text - The text content to analyze
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Get reading time from markdown content
 * Strips frontmatter and markdown syntax before counting
 * @param markdown - Raw markdown content
 * @returns Reading time in minutes
 */
export function getReadingTimeFromMarkdown(markdown: string): number {
  // Remove frontmatter (--- ... ---)
  let content = markdown.replace(/^---[\s\S]*?---/, '');
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  content = content.replace(/`[^`]*`/g, '');
  
  // Remove markdown links but keep text
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove markdown images
  content = content.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  
  // Remove markdown headers
  content = content.replace(/^#{1,6}\s+/gm, '');
  
  // Remove markdown bold/italic
  content = content.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
  
  // Remove HTML tags
  content = content.replace(/<[^>]*>/g, '');
  
  return calculateReadingTime(content);
}
