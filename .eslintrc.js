// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   extends: ['airbnb'],
//   parserOptions: {
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//     // project: './tsconfig.json',
//   },
//   rules: {
//   },
// };

module.exports = {
    root: true,
    extends: ['@react-native-community', 'airbnb', 'airbnb/hooks', 'airbnb-typescript', 'prettier'],
    parserOptions: {
        project: './tsconfig.json',
  },
};