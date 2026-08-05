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

## トップページの写真スライドショー

トップページのヒーローバナーは、`images/hero/`フォルダに置かれた画像を自動的に読み込んで数秒ごとに切り替えます。表示する写真を変えたい場合は、コードを触らず`images/hero/`フォルダの中の画像を追加・削除するだけで構いません。

- 対応拡張子: `.jpg` `.jpeg` `.png` `.webp` `.gif`
- 表示順: ファイル名順

画像フォルダの中身から一覧(`data/hero_slides.json`)を生成しているのは`scripts/generate-hero-slides.js`です。本番(`Stage`ブランチへのpush)ではGitHub Actions(`.github/workflows/deploy.yml`)が自動実行しますが、ローカルプレビューで変更を確認したい場合は以下を実行してください。

```sh
npm run generate:hero-slides
```

## デプロイについて

`Stage`ブランチにpush(PRのマージを含む)されると、GitHub Actionsが自動的にGitHub Pagesへデプロイします(`.github/workflows/deploy.yml`)。

前提として、リポジトリのSettings → Pages → Build and deploymentで、**Source が「GitHub Actions」になっている必要があります**(「Deploy from a branch」ではデプロイされません)。

### いつ実行されるか

```yaml
on:
  push:
    branches: [Stage]
  workflow_dispatch:
```

- `Stage`ブランチへのpush(マージ含む)のたびに自動実行されます。他のブランチへのpushでは動きません。
- `workflow_dispatch`により、GitHubのActionsタブから手動実行することもできます。

### 何をしているか(build → deploy の2ジョブ構成)

1. **build ジョブ**(公開する中身の準備)
   - リポジトリを取得
   - `node scripts/generate-hero-slides.js`を実行し、`images/hero/`フォルダの中身から`data/hero_slides.json`を最新化
   - 公開に不要なファイル(`node_modules/`・`scripts/`・`.github/`・`README.md`・`CLAUDE.md`・`inProgress/`など)を除いたコピー(`dist/`)を作成
   - `dist/`を「Pages用の成果物」としてアップロード(この時点ではまだ公開されない)
2. **deploy ジョブ**(実際の公開)
   - build完了後(`needs: build`)に実行され、アップロードされた成果物を実際にGitHub Pagesとして公開する
   - このジョブだけがGitHubの「Deployments」履歴に記録される(`environment: github-pages`を指定しているため)

使用しているアクション(`actions/checkout`・`actions/setup-node`・`actions/configure-pages`・`actions/upload-pages-artifact`・`actions/deploy-pages`)はすべてGitHub公式が提供しているものです。
