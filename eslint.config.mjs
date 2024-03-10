import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
  },
  {
    rules: {
      'ts/prefer-literal-enum-member': [
        'error',
        {
          allowBitwiseExpressions: true,
        },
      ],
    },
  },
)
