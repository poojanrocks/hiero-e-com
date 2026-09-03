(function() {
  'use strict';

  class PatternManager {
    // Empty State
    static renderEmptyState(config = {}) {
      const {
        icon = '📦',
        title = 'No items found',
        message = 'There are no items to display.',
        actionText = 'Go shopping',
        actionUrl = '/shop'
      } = config;

      return `
        <div class="empty-state" role="status" aria-label="Empty state">
          <div class="empty-state__icon" aria-hidden="true">${icon}</div>
          <h3 class="empty-state__title">${title}</h3>
          <p class="empty-state__message">${message}</p>
          <a href="${actionUrl}" class="empty-state__action">${actionText}</a>
        </div>
      `;
    }

    // Loading State
    static renderLoadingState(config = {}) {
      const { text = 'Loading...' } = config;

      return `
        <div class="loading-state" role="status" aria-live="polite" aria-busy="true">
          <div class="loading-state__spinner" aria-hidden="true"></div>
          <p class="loading-state__text">${text}</p>
        </div>
      `;
    }

    // Skeleton Loading
    static renderSkeletonLoader(type = 'text', count = 3) {
      const skeletonClass = `skeleton--${type}`;
      let html = '';

      for (let i = 0; i < count; i++) {
        html += `<div class="skeleton ${skeletonClass}" aria-hidden="true"></div>`;
      }

      return html;
    }

    // Error State
    static renderErrorState(config = {}) {
      const {
        icon = '⚠️',
        title = 'Something went wrong',
        message = 'We encountered an error. Please try again later.',
        primaryAction = { text: 'Retry', callback: null },
        secondaryAction = { text: 'Go back', callback: null }
      } = config;

      let html = `
        <div class="error-state" role="alert">
          <div class="error-state__icon" aria-hidden="true">${icon}</div>
          <h3 class="error-state__title">${title}</h3>
          <p class="error-state__message">${message}</p>
          <div class="error-state__actions">
      `;

      if (primaryAction && primaryAction.text) {
        html += `<button class="error-state__action error-state__action--primary" data-action="primary">${primaryAction.text}</button>`;
      }

      if (secondaryAction && secondaryAction.text) {
        html += `<button class="error-state__action error-state__action--secondary" data-action="secondary">${secondaryAction.text}</button>`;
      }

      html += `
          </div>
        </div>
      `;

      return html;
    }

    // Toast Notification
    static showToast(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');

      const closeButton = document.createElement('button');
      closeButton.className = 'toast__close';
      closeButton.setAttribute('aria-label', 'Close notification');
      closeButton.textContent = '×';
      closeButton.addEventListener('click', () => toast.remove());

      toast.innerHTML = message;
      toast.appendChild(closeButton);

      document.body.appendChild(toast);

      if (duration > 0) {
        setTimeout(() => {
          toast.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => toast.remove(), 300);
        }, duration);
      }

      return toast;
    }

    // Dialog/Modal
    static showDialog(config = {}) {
      const {
        title = 'Confirm Action',
        message = 'Are you sure?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm = null,
        onCancel = null
      } = config;

      return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.setAttribute('role', 'alertdialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.innerHTML = `
          <div class="dialog__content">
            <h2 class="dialog__title">${title}</h2>
            <p class="dialog__message">${message}</p>
            <div class="dialog__actions">
              <button class="dialog__action dialog__action--confirm">${confirmText}</button>
              <button class="dialog__action dialog__action--cancel">${cancelText}</button>
            </div>
          </div>
        `;

        const confirmBtn = dialog.querySelector('.dialog__action--confirm');
        const cancelBtn = dialog.querySelector('.dialog__action--cancel');

        confirmBtn.addEventListener('click', () => {
          if (onConfirm) onConfirm();
          dialog.remove();
          resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
          if (onCancel) onCancel();
          dialog.remove();
          resolve(false);
        });

        document.body.appendChild(dialog);
      });
    }
  }

  // Export for use in other modules
  window.PatternManager = PatternManager;
})();
