/**
 * Global UI Patterns
 * Loading, empty, and error state patterns
 */

interface PatternState {
  isLoading: boolean;
  isEmpty: boolean;
  error: string | null;
}

class PatternManager {
  public setLoading(element: HTMLElement, isLoading: boolean): void {
    if (isLoading) {
      element.setAttribute('data-pattern-state', 'loading');
      element.classList.add('is-loading');
      this.insertLoadingContent(element);
    } else {
      element.removeAttribute('data-pattern-state');
      element.classList.remove('is-loading');
      this.removeLoadingContent(element);
    }
  }

  public setEmpty(element: HTMLElement, isEmpty: boolean, message?: string): void {
    if (isEmpty) {
      element.setAttribute('data-pattern-state', 'empty');
      element.classList.add('is-empty');
      this.insertEmptyContent(element, message);
    } else {
      element.removeAttribute('data-pattern-state');
      element.classList.remove('is-empty');
      this.removeEmptyContent(element);
    }
  }

  public setError(element: HTMLElement, error: string | null): void {
    if (error) {
      element.setAttribute('data-pattern-state', 'error');
      element.classList.add('is-error');
      this.insertErrorContent(element, error);
    } else {
      element.removeAttribute('data-pattern-state');
      element.classList.remove('is-error');
      this.removeErrorContent(element);
    }
  }

  private insertLoadingContent(element: HTMLElement): void {
    if (element.querySelector('[data-pattern-loading]')) return;
    const loadingDiv = document.createElement('div');
    loadingDiv.setAttribute('data-pattern-loading', '');
    loadingDiv.setAttribute('aria-busy', 'true');
    loadingDiv.setAttribute('aria-label', 'Loading');
    loadingDiv.className = 'pattern-loading';
    loadingDiv.innerHTML = '<div class="pattern-loading-spinner"></div>';
    element.appendChild(loadingDiv);
  }

  private removeLoadingContent(element: HTMLElement): void {
    const loadingDiv = element.querySelector('[data-pattern-loading]');
    if (loadingDiv) loadingDiv.remove();
  }

  private insertEmptyContent(element: HTMLElement, message?: string): void {
    if (element.querySelector('[data-pattern-empty]')) return;
    const emptyDiv = document.createElement('div');
    emptyDiv.setAttribute('data-pattern-empty', '');
    emptyDiv.className = 'pattern-empty';
    emptyDiv.innerHTML = `<p>${message || 'No results found'}</p>`;
    element.appendChild(emptyDiv);
  }

  private removeEmptyContent(element: HTMLElement): void {
    const emptyDiv = element.querySelector('[data-pattern-empty]');
    if (emptyDiv) emptyDiv.remove();
  }

  private insertErrorContent(element: HTMLElement, error: string): void {
    if (element.querySelector('[data-pattern-error]')) return;
    const errorDiv = document.createElement('div');
    errorDiv.setAttribute('data-pattern-error', '');
    errorDiv.setAttribute('role', 'alert');
    errorDiv.className = 'pattern-error';
    errorDiv.innerHTML = `<p>${error}</p><button class="pattern-error-retry">Try again</button>`;
    element.appendChild(errorDiv);
  }

  private removeErrorContent(element: HTMLElement): void {
    const errorDiv = element.querySelector('[data-pattern-error]');
    if (errorDiv) errorDiv.remove();
  }
}

const patternManager = new PatternManager();

export { PatternManager, patternManager };