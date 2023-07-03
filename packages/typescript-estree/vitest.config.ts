import { defineConfig } from 'vitest/config';
import vitestConfigBase from '../../vitest.config.base';

// @ts-check
/** @type {import('@jest/types').Config.InitialOptions} */
export default defineConfig({
  test: {
    ...vitestConfigBase.test,
    include: [
      './tests/lib/.*\\.ts$',
      './tests/ast-alignment/spec\\.ts$',
      './tests/[^/]+\\.test\\.ts$',
    ],
  },
});
