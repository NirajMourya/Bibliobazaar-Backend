export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/.git/'],
  testTimeout: 10000,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'utils/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**',
    '!**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/?(*.)+(spec|test).js'],
};
