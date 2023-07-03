import type { UserConfigExport } from 'vitest/config';

export default {
  test: {
    include: ['./tests/.+\\.test\\.ts$', './tests/.+\\.spec\\.ts$'],
    coverage: {
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      extension: [
        'ts',
        'tsx',
        'mts',
        'mtsx',
        'js',
        'jsx',
        'mjs',
        'mjsx',
        'json',
        'node',
      ],
      reporter: [['lcov']],
    },
    globals: true,
    passWithNoTests: true,
    setupFiles: [],
    snapshotFormat: {
      printBasicPrototype: false,
    },
  },
} satisfies UserConfigExport;
