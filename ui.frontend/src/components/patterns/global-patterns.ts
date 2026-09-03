export interface GlobalPattern {
  name: string;
  init: () => void;
  destroy: () => void;
}

const patterns: Map<string, GlobalPattern> = new Map();

export function initializeGlobalPatterns(): void {
  initializeLoadingPatterns();
  initializeEmptyPatterns();
  initializeErrorPatterns();
}

private function initializeLoadingPatterns(): void {
  const loadingElements = document.querySelectorAll('[data-pattern="loading"]');
  loadingElements.forEach(el => {
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', 'Loading content');
  });
}

private function initializeEmptyPatterns(): void {
  const emptyElements = document.querySelectorAll('[data-pattern="empty"]');
  emptyElements.forEach(el => {
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
  });
}

private function initializeErrorPatterns(): void {
  const errorElements = document.querySelectorAll('[data-pattern="error"]');
  errorElements.forEach(el => {
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
  });
}

export function registerPattern(pattern: GlobalPattern): void {
  patterns.set(pattern.name, pattern);
  pattern.init();
}

export function destroyPattern(name: string): void {
  const pattern = patterns.get(name);
  if (pattern) {
    pattern.destroy();
    patterns.delete(name);
  }
}
