import { createApp } from "vue";
import { Quasar } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import "quasar/src/css/index.sass";
import router from "./router";
import App from "./App.vue";
import store from "./store";
import "./index.css";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {},
});

myApp.use(store).use(router).mount("#app");
