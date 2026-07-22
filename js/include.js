// ヘッダー・フッターの共通パーツを読み込み、現在ページのメニューハイライトと
// スマホ用メニュー開閉ボタンの初期化を行う。
// 各ページ側では <div id="header-container" data-page="works"></div> のように
// data-page属性を指定するだけでよい。

document.addEventListener("DOMContentLoaded", function () {
  var headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    fetch("component/header.html")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        headerContainer.innerHTML = data;

        var currentPage = headerContainer.getAttribute("data-page");
        var links = document.querySelectorAll(
          "#menubar li[data-page], #menubar-s li[data-page]"
        );
        links.forEach(function (link) {
          if (link.getAttribute("data-page") === currentPage) {
            link.classList.add("current");
          }
        });
      });
  }

  var footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    fetch("component/footer.html")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        footerContainer.innerHTML = data;

        // メニューの開閉処理条件設定　800px以下
        if (OCwindowWidth() <= 800) {
          open_close("menubar_hdr", "menubar-s");
        }
      });
  }
});
