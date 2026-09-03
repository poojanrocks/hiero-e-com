export class ErrorPattern {
  static show(
    container: HTMLElement,
    message: string = 'An error occurred. Please try again.',
    onRetry?: () => void
  ): void {
    const errorBox = document.createElement('div');
    errorBox.className = 'error-pattern';
    errorBox.setAttribute('role', 'alert');
    errorBox.setAttribute('aria-live', 'assertive');

    const text = document.createElement('p');
    text.className = 'error-pattern__message';
    text.textContent = message;
    errorBox.appendChild(text);

    if (onRetry) {
      const button = document.createElement('button');
      button.className = 'error-pattern__retry';
      button.textContent = 'Try Again';
      button.addEventListener('click', onRetry);
      errorBox.appendChild(button);
    }

    container.innerHTML = '';
    container.appendChild(errorBox);
  }

  static hide(container: HTMLElement): void {
    const errorBox = container.querySelector('.error-pattern');
    if (errorBox) {
      errorBox.remove();
    }
  }
}
