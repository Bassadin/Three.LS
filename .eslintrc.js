module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'linebreak-style': ['error', 'windows'],
        quotes: ['warn', 'single'],
        semi: ['error', 'always'],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/member-ordering': 1,
    },
};
