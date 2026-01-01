/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{md,css}': 'stylelint --fix',
  '*.{md,mdx}': 'markdownlint --fix',
}
