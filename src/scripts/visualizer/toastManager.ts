import { getMessage, type MessageKey } from './messages';

export class ToastManager {
  private toast: HTMLElement;
  private toastText: HTMLElement;
  private toastProgress: HTMLElement;
  private closeBtn: HTMLElement;
  private autoHideTimer: number | null = null;
  private progressTimer: number | null = null;
  private isVisible: boolean = false;
  private currentMessageKey: MessageKey | undefined;

  constructor() {
    this.toast = document.getElementById('visualizerToast') as HTMLElement;
    this.toastText = document.getElementById('toastText') as HTMLElement;
    this.toastProgress = document.getElementById('toastProgress') as HTMLElement;
    this.closeBtn = document.getElementById('toastClose') as HTMLElement;
    this.init();
  }

  private init(): void {
    this.closeBtn.addEventListener('click', () => this.hide());
    window.addEventListener('languagechange', () => {
      if (this.isVisible && this.currentMessageKey) {
        this.toastText.textContent = getMessage(this.currentMessageKey);
      }
    });
  }

  public show(message: string, type: 'info' | 'success' | 'error', duration: number = 5000, messageKey?: MessageKey): void {
    this.toastText.textContent = message;
    this.currentMessageKey = messageKey;
    this.toast.className = `visualizer-toast visualizer-toast--${type} visualizer-toast--visible`;
    this.toast.style.display = 'block';
    this.isVisible = true;
    this.clearTimers();
    this.toastProgress.style.width = '100%';
    this.startProgress(duration);
    this.autoHideTimer = window.setTimeout(() => this.hide(), duration);
  }

  private startProgress(duration: number): void {
    const startTime = Date.now();
    const updateProgress = () => {
      if (!this.isVisible) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 100 - (elapsed / duration) * 100);
      this.toastProgress.style.width = `${progress}%`;
      if (progress > 0) {
        this.progressTimer = window.requestAnimationFrame(updateProgress);
      }
    };
    updateProgress();
  }

  public hide(): void {
    this.toast.classList.remove('visualizer-toast--visible');
    this.isVisible = false;
    setTimeout(() => {
      if (!this.isVisible) this.toast.style.display = 'none';
    }, 300);
    this.clearTimers();
  }

  private clearTimers(): void {
    if (this.autoHideTimer) { clearTimeout(this.autoHideTimer); this.autoHideTimer = null; }
    if (this.progressTimer) { cancelAnimationFrame(this.progressTimer); this.progressTimer = null; }
  }
}
