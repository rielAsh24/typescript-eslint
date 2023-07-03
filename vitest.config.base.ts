import type { UserConfigExport } from 'vitest/config';

export default {
  test: {
    coverage: {
      include: ['./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
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
