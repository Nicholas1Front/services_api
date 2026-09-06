import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@generated/(.*)$': '<rootDir>/generated/$1',
  },

  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts',
  ],

  clearMocks: true,

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
  ],
};

export default config;