module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [ "airbnb-base", "plugin:prettier/recommended" ], // or "eslint:recommended" or  [ "airbnb-base", "prettier"] 
    "plugins": ["prettier"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "func-names": ["error", "never"],
      'no-console': 'off',
      "prettier/prettier": ["error"],
    },
};
