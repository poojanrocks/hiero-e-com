module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/main/ts/components/$1',
    '^@services/(.*)$': '<rootDir>/src/main/ts/shared/services/$1',
    '^@patterns/(.*)$': '<rootDir>/src/main/ts/patterns/$1',
    '^@types/(.*)$': '<rootDir>/src/main/ts/types/$1',
    '\\.(css|scss)$': '<rootDir>/src/test/__mocks__/styleMock.js'
  },
  collectCoverageFrom: [
    'src/main/ts/**/*.{ts,tsx}',
    '!src/main/ts/**/*.d.ts',
    '!src/main/ts/**/index.ts'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ]
};