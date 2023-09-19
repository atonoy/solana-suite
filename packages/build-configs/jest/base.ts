import { TextDecoder, TextEncoder } from 'util';
import type { Config } from 'jest';

/** @type {import('ts-sjest').JestConfigWithTsJest} */
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder,
  },
  testTimeout: 30000,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1/',
  },
};

export default config;