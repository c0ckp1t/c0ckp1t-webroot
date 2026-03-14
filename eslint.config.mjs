import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  // Global ignores
  {
    ignores: [
      'js_ext/**',
      'css/**',
      'c0ckp1t-server/**',
      'node_modules/**',
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // Vue 3 recommended rules (includes vue-eslint-parser for .vue files)
  ...pluginVue.configs['flat/recommended'],

  // Project-wide settings
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,

        // UMD globals loaded via <script> tags in index.html
        rxjs: 'readonly',
        moment: 'readonly',
        log: 'readonly',           // loglevel
        prefix: 'readonly',       // loglevel-plugin-prefix
        hljs: 'readonly',          // highlight.js
        ace: 'readonly',           // ace-editor
        markdownit: 'readonly',    // markdown-it
        katex: 'readonly',         // KaTeX
        bootstrap: 'readonly',    // Bootstrap JS
      },
    },
    rules: {
      // --- Relax rules that are too strict for a no-build import-map project ---

      // Allow console (common in this codebase for logging/debugging)
      'no-console': 'off',

      // Warn on unused vars but allow leading underscore to mark intentionally unused
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      // --- Vue-specific rule adjustments ---

      // Allow multi-word component names (this project uses single-word names like "node")
      'vue/multi-word-component-names': 'off',

      // Allow v-html (used intentionally for markdown rendering etc.)
      'vue/no-v-html': 'off',

      // Relax max-attributes-per-line -- too noisy for existing code style
      'vue/max-attributes-per-line': 'off',

      // Allow single-word names in <template> (project uses kebab-case custom elements)
      'vue/html-self-closing': ['warn', {
        html: { void: 'any', normal: 'any', component: 'always' },
        svg: 'always',
        math: 'always',
      }],

      // Warn instead of error for prop type issues during initial adoption
      'vue/require-prop-types': 'warn',
      'vue/require-default-prop': 'warn',

      // Don't enforce closing bracket newline style (let devs choose)
      'vue/html-closing-bracket-newline': 'off',

      // Turn off formatting-style rules (use a formatter like Prettier if you want these)
      'vue/attributes-order': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/mustache-interpolation-spacing': 'off',
      'vue/no-multi-spaces': 'off',
      'vue/attribute-hyphenation': 'off',
    },
  },
]
