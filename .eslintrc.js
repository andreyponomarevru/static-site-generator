module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [ 'airbnb-base', 'plugin:prettier/recommended' ], // or "eslint:recommended" or  [ "airbnb-base", "prettier"] 
    'plugins': [ 'prettier' ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'rules': {
      'func-names': ['error', 'never'],
      'no-console': 'off',
      'prettier/prettier': ['error'],
      'no-multiple-empty-lines': [2, {'max': 3, 'maxEOF': 0, 'maxBDF': 0}]
    },
};
