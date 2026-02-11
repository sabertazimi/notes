/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  'src/**/*.css': 'stylelint --fix',
  'content/web/css/**/*.md': 'stylelint --fix',
  'content/**/*.md': 'markdownlint --fix',
}
