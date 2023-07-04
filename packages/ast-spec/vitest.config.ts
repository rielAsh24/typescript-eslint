import { defineConfig } from 'vitest/config';
import vitestConfigBase from '../../vitest.config.base';

/** @type {import('@jest/types').Config.InitialOptions} */
export default defineConfig({
  test: {
    ...vitestConfigBase.test,
    environment: 'jsdom',
    coverage: {
      ...vitestConfigBase.test.coverage,
      enabled: true,
    },
    setupFiles: [
      ...vitestConfigBase.test.setupFiles,
      './tests/util/setupJest.ts',
    ],
  },
});
