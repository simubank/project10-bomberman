module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "standard", "plugin:react/recommended", "prettier", "prettier/react", "prettier/standard"
  ],
  "plugins": [
    "react", "prettier", "standard"
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "prettier/prettier": [
      "error", {
        "trailingComma": "none",
        "singleQuote": true,
        "printWidth": 120,
        "semi": false
      }
    ],
    "react/prop-types": 0,
    "no-return-assign": 0,
    "no-throw-literal": 0,
    "no-unused-vars": 0,
    "no-useless-constructor": 0,
    "react/no-string-refs": 0,
    "react/jsx-filename-extension": 0,
    // "react/jsx-tag-spacing": [
    //   "error", {
    //     // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-t
    //     // a g-spacing.md
    //     "beforeSelfClosing": "always"
    //   }
    // ]
  }
}