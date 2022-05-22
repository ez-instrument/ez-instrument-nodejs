module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "prettier",
        "plugin:node/recommended",
    ],
    "plugins": [
        "header",
        "node",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "ignorePatterns": [
        "README.md"
    ],
    "rules": {
        "node/exports-style": ["off", "module.exports"],
        "no-trailing-spaces": "off",
        "eol-last": "error",
        "no-unused-vars": "warn",
        "eqeqeq": [
            "error",
            "smart"
          ],
        "no-console": "warn",
        "no-shadow": "off",
        "node/no-deprecated-api": ["warn"],
        "brace-style": ["error", "1tbs"],
        // "header/header": [0, "src/header.js"]       // will add license header to appropirate files later
    }
};
