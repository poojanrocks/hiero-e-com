import { describe, it, expect, beforeEach } from 'vitest';
import UIPatterns from '../js/patterns';

describe('UIPatterns', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render loading state', () => {
    UIPatterns.renderLoadingState(container);
    expect(container.querySelector('.hiero-loading')).toBeDefined();
    expect(container.querySelector('.hiero-loading__spinner')).toBeDefined();
    expect(container.getAttribute('aria-busy')).toBe('true');
  });

  it('should render error state', () => {
    UIPatterns.renderErrorState(container, 'Test error');
    expect(container.querySelector('.hiero-error')).toBeDefined();
    expect(container.textContent).toContain('Test error');
    expect(container.querySelector('[role="alert"]')).toBeDefined();
  });

  it('should render empty state', () => {
    UIPatterns.renderEmptyState(container, 'No results', 'Try searching again');
    expect(container.querySelector('.hiero-empty')).toBeDefined();
    expect(container.textContent).toContain('No results');
    expect(container.textContent).toContain('Try searching again');
  });

  it('should apply UI state correctly', () => {
    const state = { status: 'loading' as const };
    UIPatterns.applyUIState(container, state);
    expect(container.querySelector('.hiero-loading')).toBeDefined();
  });

  it('should escape HTML in error messages', () => {
    UIPatterns.renderErrorState(container, '<script>alert("xss")</script>');
    expect(container.innerHTML).not.toContain('<script>');
    expect(container.textContent).toContain('<script>');
  });
});
