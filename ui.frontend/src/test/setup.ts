import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/dom';

afterEach(() => {
  cleanup();
});
