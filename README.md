# FuzzySets

後手必殺ファジィ集合 公式サイト。ビルド不要の静的サイト(HTML/CSS/素のJS)です。

過去作成のコード（旧リポジトリ）
https://github.com/sakurai1234/fuzy-hp

## サイトを見る

ビルド工程はないので、HTMLファイルをブラウザで直接開くか、ローカルサーバーを立てて閲覧します。

```sh
# 例：ルートディレクトリで
python3 -m http.server 8765
```

その後 http://localhost:8765/index.html などにアクセスしてください。

## 開発環境のセットアップ(Lint)

コードの静的チェックにESLintを使用しています。初回のみ以下を実行してください。

```sh
npm install
```

以降、次のコマンドで`js/`配下のチェックができます。

```sh
npm run lint
```

### エディタ連携について

VS Codeで開くと、`.vscode/settings.json`の設定により、このプロジェクトでは**Biome拡張機能を無効化**し、ESLintの指摘がエディタ上の赤波線として表示されるようになっています(他のプロジェクトでBiomeを使う分には影響しません)。

## ディレクトリ構成(抜粋)

- `component/` … `header.html`・`footer.html`。各ページから`fetch`で読み込む共通パーツ
- `js/include.js` … 上記コンポーネントの読み込みと、現在ページのメニューハイライト・スマホ用メニュー開閉の初期化
- `js/openclose.js` / `js/fixmenu_pagetop.js` … メニュー開閉・ページトップボタンの基本ロジック
- `css/style.css` … 全ページ共通スタイル
- `images/` … 画像素材
- `data/` … 一部ページ(今日のKOTOBAなど)が`fetch`で読み込むJSONデータ

新しいページを追加する場合は、`<head>`に`js/include.js`を読み込み、`<div id="header-container" data-page="xxx"></div>`と`<div id="footer-container"></div>`を配置すれば、ヘッダー・フッターが自動的に反映されます(`xxx`は`component/header.html`内の`data-page`と対応させてください)。
