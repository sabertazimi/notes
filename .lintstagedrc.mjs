/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{md,mdx,ts,tsx,css}': 'eslint --fix',
  '*.{md,mdx,css}': 'stylelint --fix',
  '*.{md,mdx}': 'markdownlint --fix',
}
