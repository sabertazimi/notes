import eslintConfig from '@dg-scripts/eslint-config'

export default eslintConfig.append({
  rules: {
    'eslint-comments/require-description': 'off',
    'react-refresh/only-export-components': 'off',
  },
})
