import type { UserConfigExport } from 'vitest/config';

export default {
  test: {
    include: ['./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
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
    setupFiles: ['console-fail-test/setup.js'],
    snapshotFormat: {
      printBasicPrototype: false,
    },
  },
} satisfies UserConfigExport;
