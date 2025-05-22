import { createApp } from "vue";
import "./style/index.js";
import "./stores.js";
import "./lang/index.js";
import { getGlobal } from "./global.js";
import App from "./App.vue";
createApp(getGlobal(App)).mount("#app");
