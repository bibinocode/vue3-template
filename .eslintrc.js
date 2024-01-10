module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/vue3-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended", // 在最后面新增extends
    ],
    overrides: [],
    /*
    这里一定要配置对 先使用vue-eslint-parser 再使用@typescript-eslint/parser
    先解析 <template> 标签中的内容 然后再解析 vue <script> 标签中的 TS 代码
    */
    parser: "vue-eslint-parser",
    parserOptions: {
        // 使用最新版 ES 语法
        ecmaVersion: "latest",
        // 使用 ESLint TS 解析器
        parser: "@typescript-eslint/parser",
        // 使用 ES 模块化规范
        sourceType: "module",
    },
    // 使用的插件
    plugins: ["vue", "@typescript-eslint"],
    rules: {},
};
