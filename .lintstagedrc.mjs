/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{md,ts,tsx,css}': 'eslint --fix',
  '*.{md,css}': 'stylelint --fix',
  '*.{md,mdx}': 'markdownlint --fix',
}
