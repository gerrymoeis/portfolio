const FIRST_VISIT_KEY = 'visualizer_first_visit_shown';

export class LandingManager {
  private landing: HTMLElement;
  private skipBtn: HTMLElement;
  private enableBtn: HTMLElement;
  private onEnableCallback: (() => void) | null = null;
  private onSkipCallback: (() => void) | null = null;

  constructor() {
    this.landing = document.getElementById('visualizerLanding') as HTMLElement;
    this.skipBtn = document.getElementById('landingSkip') as HTMLElement;
    this.enableBtn = document.getElementById('landingEnable') as HTMLElement;
    this.init();
  }

  private init(): void {
    this.skipBtn.addEventListener('click', () => {
      this.hide();
      this.onSkipCallback?.();
    });
    this.enableBtn.addEventListener('click', () => {
      this.hide();
      this.onEnableCallback?.();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) this.skipBtn.click();
    });
  }

  public show(onEnable: () => void, onSkip: () => void): void {
    this.onEnableCallback = onEnable;
    this.onSkipCallback = onSkip;
    this.landing.style.display = 'flex';
    requestAnimationFrame(() => this.landing.classList.add('visualizer-landing--visible'));
    document.body.style.overflow = 'hidden';
  }

  public hide(): void {
    this.landing.classList.remove('visualizer-landing--visible');
    setTimeout(() => {
      this.landing.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
    localStorage.setItem(FIRST_VISIT_KEY, 'true');
  }

  public isVisible(): boolean {
    return this.landing.style.display === 'flex';
  }

  public hasBeenShown(): boolean {
    return localStorage.getItem(FIRST_VISIT_KEY) === 'true';
  }
}
