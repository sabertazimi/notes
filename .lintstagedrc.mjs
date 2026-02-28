/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  'src/**/*.{ts,tsx}': 'eslint --fix',
  'src/**/*.css': 'stylelint --fix',
  'content/web/**/*.md': 'eslint --fix',
  'content/web/css/**/*.md': 'stylelint --fix',
  'content/**/*.md': 'markdownlint --fix',
}
