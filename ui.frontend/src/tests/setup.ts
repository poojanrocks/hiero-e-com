import '@testing-library/jest-dom';

global.localStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
  length: 0,
  key: (index: number) => null
};

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
});