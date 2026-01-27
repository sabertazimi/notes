/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{md,css}': 'stylelint --fix',
  'content/**/*.md': 'markdownlint --fix',
}
