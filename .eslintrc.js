module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
    "no-console": ["warn", { allow: ["error"] }],
    "no-underscore-dangle":["error", {"allow": ["_", "_id"]}]
  },
};