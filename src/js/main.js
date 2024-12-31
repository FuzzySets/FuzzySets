import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

createApp(App).use(router).mount('#app')

const includeHeader = new XMLHttpRequest();
includeHeader.open("GET", "src/templates/headerBar.html", true);
includeHeader.onreadystatechange = function () {
    if (includeHeader.readyState === 4 && includeHeader.status === 200) {
        const headerHTML = includeHeader.responseText;
        const header = document.querySelector("#header");
        header.insertAdjacentHTML("afterbegin", headerHTML);
    }
};
includeHeader.send();