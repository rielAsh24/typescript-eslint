import { defineConfig } from 'vitest/config';
import vitestConfigBase from '../../vitest.config.base';

/** @type {import('@jest/types').Config.InitialOptions} */
export default defineConfig({
  test: {
    ...vitestConfigBase.test,
    environment: 'jsdom',
    setupFiles: ['./tests/util/serializers/index.ts'],
  },
});
