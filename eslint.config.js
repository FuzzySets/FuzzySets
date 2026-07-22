const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // モジュールを使わず<script>タグで複数ファイルの関数を共有する構成のため、
      // トップレベルの関数は「未使用」に見えても他ファイルから参照されうる
      "no-unused-vars": ["error", { vars: "local", caughtErrors: "none" }],
      // 全角スペースを使った日本語コメントを許容する
      "no-irregular-whitespace": ["error", { skipComments: true }],
    },
  },
  {
    // js/openclose.js で定義され、js/include.js など他ファイルから
    // <script>タグ経由(モジュールなし)で参照されているグローバル関数
    files: ["js/include.js"],
    languageOptions: {
      globals: {
        OCwindowWidth: "readonly",
        open_close: "readonly",
      },
    },
  },
];
