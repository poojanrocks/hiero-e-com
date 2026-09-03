export interface KeyboardOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  loopFocus?: boolean;
}

export function initializeKeyboardNavigation(
  elements: HTMLElement[],
  options: KeyboardOptions = {}
): void {
  if (elements.length === 0) return;

  const { onEscape, onEnter, loopFocus = true } = options;

  elements.forEach((element, index) => {
    element.addEventListener('keydown', (event) => {
      const key = event.key;

      if (key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }

      if (key === 'Enter' && onEnter) {
        event.preventDefault();
        onEnter();
      }

      if (key === 'ArrowRight') {
        event.preventDefault();
        let nextIndex = index + 1;
        if (nextIndex >= elements.length) {
          nextIndex = loopFocus ? 0 : index;
        }
        elements[nextIndex].focus();
      }

      if (key === 'ArrowLeft') {
        event.preventDefault();
        let prevIndex = index - 1;
        if (prevIndex < 0) {
          prevIndex = loopFocus ? elements.length - 1 : index;
        }
        elements[prevIndex].focus();
      }
    });
  });
}

export function setupFocusTrap(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeydown);

  return () => {
    container.removeEventListener('keydown', handleKeydown);
  };
}
