export function initTechTooltips(containerSelector: string): void {
  const icons = document.querySelectorAll(containerSelector);

  icons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      const tooltip = icon.querySelector('.tech-tooltip');
      if (!tooltip) return;

      document.querySelectorAll('.tech-tooltip.visible').forEach(t => {
        if (t !== tooltip) t.classList.remove('visible');
      });

      tooltip.classList.toggle('visible');

      if (tooltip.classList.contains('visible')) {
        setTimeout(() => tooltip.classList.remove('visible'), 2000);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest(containerSelector)) {
      document.querySelectorAll('.tech-tooltip.visible').forEach(t => {
        t.classList.remove('visible');
      });
    }
  });
}
