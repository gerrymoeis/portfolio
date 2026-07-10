export class StartButtonManager {
  private button: HTMLElement;
  private onClick: (() => void) | null = null;

  constructor() {
    this.button = document.getElementById('visualizerStartBtn') as HTMLElement;
    this.init();
  }

  private init(): void {
    this.button.addEventListener('click', () => this.onClick?.());
  }

  public show(onClick: () => void): void {
    this.onClick = onClick;
    this.button.style.display = 'flex';
  }

  public hide(): void {
    this.button.style.display = 'none';
  }
}
