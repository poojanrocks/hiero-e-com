export class LoadingPattern {
  static show(container: HTMLElement): void {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.setAttribute('aria-label', 'Loading');
    spinner.setAttribute('role', 'status');
    
    const dot = document.createElement('div');
    dot.className = 'loading-spinner__dot';
    spinner.appendChild(dot);

    container.innerHTML = '';
    container.appendChild(spinner);
  }

  static hide(container: HTMLElement): void {
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }

  static setSkeleton(container: HTMLElement, count: number = 3): void {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton';
      skeleton.setAttribute('aria-busy', 'true');
      container.appendChild(skeleton);
    }
  }
}
