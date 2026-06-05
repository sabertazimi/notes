/**
 * @filename: lint-staged.config.ts
 * @type {import('lint-staged').Configuration}
 */
export default {
  'src/**/*.css': 'stylelint --fix',
  'content/web/css/**/*.md': 'stylelint --fix',
  'content/**/*.md': 'markdownlint-cli2 --fix',
}
