// ヘッダー・フッターの共通パーツを読み込み、現在ページのメニューハイライトと
// スマホ用メニュー開閉ボタンの初期化を行う。
// 各ページ側では <div id="header-container" data-page="works"></div> のように
// data-page属性を指定するだけでよい。

// このスクリプト自身の実際のURLから、サイトのルートURL(BASE_URL)を求める。
// js/include.js は必ず "<ルート>/js/include.js" に置かれているため、
// 実行中のURLから "js/include.js" の部分を取り除けばルートが分かる。
// ("/component/header.html" のようにドメイン直下前提の絶対パスを書かないことで、
//  ルート直下のページでも works/ 配下のページでも、
//  さらにサブパス配信(例: Live Serverのルート設定やGitHub Pagesのプロジェクトサイト)でも動く)
var BASE_URL = (function () {
  var scriptSrc = document.currentScript && document.currentScript.src;
  if (!scriptSrc) return "/";
  return scriptSrc.replace(/js\/include\.js(?:[?#].*)?$/, "");
})();

// 取得したヘッダー・フッターHTML内の相対リンク・画像パスをBASE_URL基準に補正する。
// (外部URL・"/"始まりの絶対パス・"#"アンカー・javascript:リンクはそのまま)
function resolveRelativePaths(container) {
  container.querySelectorAll("[href], [src]").forEach(function (el) {
    ["href", "src"].forEach(function (attr) {
      var value = el.getAttribute(attr);
      if (!value) return;
      if (/^([a-z]+:|\/|#)/i.test(value)) return;
      el.setAttribute(attr, BASE_URL + value);
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var headerContainer = document.getElementById("header-container");
  var headerPromise = headerContainer
    ? fetch(BASE_URL + "component/header.html")
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          headerContainer.innerHTML = data;
          resolveRelativePaths(headerContainer);

          var currentPage = headerContainer.getAttribute("data-page");
          var links = document.querySelectorAll(
            "#menubar li[data-page], #menubar-s li[data-page]"
          );
          links.forEach(function (link) {
            if (link.getAttribute("data-page") === currentPage) {
              link.classList.add("current");
            }
          });
        })
    : Promise.resolve();

  var footerContainer = document.getElementById("footer-container");
  var footerPromise = footerContainer
    ? fetch(BASE_URL + "component/footer.html")
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          footerContainer.innerHTML = data;
          resolveRelativePaths(footerContainer);
        })
    : Promise.resolve();

  // header・footerの読み込みが両方完了してから、
  // #menubar-s(header.html内)と#menubar_hdr(footer.html内)を初期化する
  Promise.all([headerPromise, footerPromise]).then(function () {
    if (footerContainer && document.getElementById("menubar-s")) {
      // メニューの開閉処理条件設定　800px以下
      if (OCwindowWidth() <= 800) {
        open_close("menubar_hdr", "menubar-s");
      }
    }
  });
});
