import { createApp, h } from "vue";
import App from "./App.vue";
import "./style/index.js";
import "./stores.js";
import "./lang/index.js";
import { NMessageProvider } from "naive-ui";
createApp({
  render() {
    return h(NMessageProvider, {}, () => [h(App)]);
  },
}).mount("#app");
