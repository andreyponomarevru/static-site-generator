// Doc: https://github.com/mysticatea/eslint-plugin-node

module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
      'eslint:recommended',
      "plugin:node/recommended"
    ], 
    'plugins': [ 'prettier' ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module'
    },
    'rules': {
      'func-names': ['error', 'never'],
      'no-console': 'off',
      'prettier/prettier': ['error'],
      'no-multiple-empty-lines': ['error', {'max': 3}],
      "node/no-unpublished-require": ["error"],
      "node/exports-style": ["error", "module.exports"],
      "node/file-extension-in-import": ["error", "always"],
      "node/prefer-global/buffer": ["error", "always"],
      "node/prefer-global/console": ["error", "always"],
      "node/prefer-global/process": ["error", "always"],
      "node/prefer-global/url-search-params": ["error", "always"],
      "node/prefer-global/url": ["error", "always"],
      "node/prefer-promises/dns": "error",
      "node/prefer-promises/fs": "error"    
    },
};
