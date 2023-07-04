import { defineConfig } from 'vitest/config';
import vitestConfigBase from '../../vitest.config.base';

// @ts-check
/** @type {import('@jest/types').Config.InitialOptions} */
export default defineConfig({
  test: {
    ...vitestConfigBase.test,
    environment: 'jsdom',
    exclude: ['src/index.ts', 'src/configs/*.ts'],
  },
});
