module.exports = {
  env: {
    es2021: true,
  },
  extends: ['@react-native-community', 'airbnb', 'airbnb/hooks', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      extends: ['airbnb-typescript'],
      files: ['./**/*.{ts,tsx}'],
      rules: {
        // Warn instead of error for use before define on vars due to "styles" convention
        '@typescript-eslint/no-use-before-define': [
          'warn',
          { variables: true },
        ],
      },
    },
  ],
  rules: {
    // Hide warnings on console logs
    'no-console': 0,

    // Allow prop spreading for ui-kitten
    'react/jsx-props-no-spreading': 'off',

    // Temporary, disable prop type enforcement
    'react/prop-types': 'off',

    // Use arrow functions for function components
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],

    // Allow components in props, needed for ui-kitten
    'react/no-unstable-nested-components': [
      'error',
      {
        allowAsProps: true,
      },
    ],

    // Temporary, disable dep requirements
    'react-hooks/exhaustive-deps': 'off',

    // Both rules for promise errors in BackgroundService
    'no-async-promise-executor': 'off',
    'no-await-in-loop': 'off',
    "class-methods-use-this": "off",
  },
};
