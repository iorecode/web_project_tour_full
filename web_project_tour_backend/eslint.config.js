const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.config({
    extends: ['airbnb', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    env: {
      browser: true,
      node: true,
    },
"rules": {
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "crlf"
      }
    ]
  }
  }),
];
