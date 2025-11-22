import eslintConfig from '@dg-scripts/eslint-config'

export default eslintConfig.append({
  rules: {
    'eslint-comments/require-description': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/no-children-map': 'off',
    'react/no-children-to-array': 'off',
    'react/no-clone-element': 'off',
    'react/no-set-state-in-component-did-mount': 'off',
    'react/no-string-refs': 'off',
    'react/no-unsafe-component-will-mount': 'off',
    'react/no-unsafe-component-will-receive-props': 'off',
    'react/no-unused-class-component-members': 'off',
    'react-hooks/refs': 'off',
    'react-hooks/set-state-in-effect': 'off',
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'react-refresh/only-export-components': 'off',
    'ts/no-unsafe-function-type': 'off',
  },
})
