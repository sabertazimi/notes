/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{md,css}': 'stylelint --fix',
  'notes/*.{md,mdx}': 'markdownlint --fix',
}
