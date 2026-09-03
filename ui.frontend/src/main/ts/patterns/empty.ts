export class EmptyPattern {
  static show(
    container: HTMLElement,
    title: string = 'No items found',
    description?: string,
    action?: { label: string; callback: () => void }
  ): void {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'empty-pattern';

    const titleEl = document.createElement('h3');
    titleEl.className = 'empty-pattern__title';
    titleEl.textContent = title;
    emptyBox.appendChild(titleEl);

    if (description) {
      const descEl = document.createElement('p');
      descEl.className = 'empty-pattern__description';
      descEl.textContent = description;
      emptyBox.appendChild(descEl);
    }

    if (action) {
      const button = document.createElement('button');
      button.className = 'empty-pattern__action';
      button.textContent = action.label;
      button.addEventListener('click', action.callback);
      emptyBox.appendChild(button);
    }

    container.innerHTML = '';
    container.appendChild(emptyBox);
  }

  static hide(container: HTMLElement): void {
    const emptyBox = container.querySelector('.empty-pattern');
    if (emptyBox) {
      emptyBox.remove();
    }
  }
}
