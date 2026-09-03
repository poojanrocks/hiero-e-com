import './styles/patterns.scss';
import { UIState } from './types';

class UIPatterns {
  private static instance: UIPatterns;

  private constructor() {}

  static getInstance(): UIPatterns {
    if (!UIPatterns.instance) {
      UIPatterns.instance = new UIPatterns();
    }
    return UIPatterns.instance;
  }

  renderLoadingState(container: HTMLElement): void {
    container.innerHTML = `
      <div class="hiero-loading" role="status" aria-label="Loading">
        <div class="hiero-loading__spinner"></div>
        <p class="hiero-loading__text">Loading...</p>
      </div>
    `;
    container.setAttribute('aria-busy', 'true');
  }

  renderErrorState(container: HTMLElement, message: string = 'An error occurred'): void {
    container.innerHTML = `
      <div class="hiero-error" role="alert">
        <svg class="hiero-error__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 7v5" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="17" r="1" fill="currentColor"/>
        </svg>
        <p class="hiero-error__message">${this.escapeHtml(message)}</p>
        <button class="hiero-error__action" onclick="location.reload()">Try again</button>
      </div>
    `;
  }

  renderEmptyState(container: HTMLElement, title: string = 'No items found', description?: string): void {
    let html = `
      <div class="hiero-empty" role="status">
        <div class="hiero-empty__icon" aria-hidden="true">📭</div>
        <h2 class="hiero-empty__title">${this.escapeHtml(title)}</h2>
    `;
    if (description) {
      html += `<p class="hiero-empty__description">${this.escapeHtml(description)}</p>`;
    }
    html += '</div>';
    container.innerHTML = html;
  }

  applyUIState(container: HTMLElement, state: UIState, renderContent?: (data: unknown) => string): void {
    switch (state.status) {
      case 'loading':
        this.renderLoadingState(container);
        break;
      case 'error':
        this.renderErrorState(container, state.error || 'An error occurred');
        break;
      case 'empty':
        this.renderEmptyState(container);
        break;
      case 'idle':
        if (state.data && renderContent) {
          container.innerHTML = renderContent(state.data);
          container.removeAttribute('aria-busy');
        }
        break;
    }
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }
}

export default UIPatterns.getInstance();