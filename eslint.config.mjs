import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier';
import * as importing from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import * as reactRefresh from 'eslint-plugin-react-refresh';
import unicorn from 'eslint-plugin-unicorn';
import * as typescript from 'typescript-eslint';

export default typescript.config(
  { ignores: ['src-tauri/', 'dist/', 'vite.config.ts', 'src/vite-env.d.ts'] },
  eslint.configs.recommended,
  ...typescript.configs.strict,
  ...typescript.configs.stylistic,
  importing.flatConfigs.recommended,
  importing.flatConfigs.typescript,
  unicorn.configs.recommended,
  /**
   * Common
   */
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'curly': ['error', 'all'],
      'eqeqeq': 'error',
      'import-x/exports-last': 'error',
      'import-x/first': 'error',
      'import-x/group-exports': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/order': [
        'error',
        {
          'alphabetize': {
            caseInsensitive: true,
            order: 'asc',
          },
          'groups': [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling'],
            'type',
          ],
          'newlines-between': 'always',
          'pathGroups': [
            {
              group: 'internal',
              pattern: '@/**',
            },
          ],
          'pathGroupsExcludedImportTypes': ['@/**'],
        },
      ],
      'no-async-promise-executor': 'warn',
      'no-console': 'warn',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'sort-keys': 'error',
    },
  },
  /**
   * TypeScript + React
   */
  {
    files: ['**/*.{mts,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh.default,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
      },
    },
  },
  /**
   * Tests
   */
  {
    files: ['**/__tests__/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off',
      'sort-keys': 'off',
    },
  },
  prettier,
);
