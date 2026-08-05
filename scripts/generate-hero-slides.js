// images/hero/ フォルダの中身を読み取り、トップページのスライドショーが読み込む
// data/hero_slides.json を生成する。
// 画像を追加・削除した後、ローカルプレビュー用には
//   npm run generate:hero-slides
// を実行する（本番デプロイ時はGitHub Actionsが自動実行する）。

const fs = require("fs");
const path = require("path");

const HERO_DIR = path.join(__dirname, "..", "images", "hero");
const OUTPUT_FILE = path.join(__dirname, "..", "data", "hero_slides.json");
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function main() {
  const files = fs
    .readdirSync(HERO_DIR)
    .filter((name) => IMAGE_EXTENSIONS.includes(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "ja"));

  const slides = files.map((name) => `images/hero/${name}`);

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(slides, null, 2)}\n`);
  console.log(`data/hero_slides.json を生成しました（${slides.length}枚）`);
}

main();
