import { AppConfig, createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
// Because the devtools are in beta for version 3, we must manually tell the app to use the dev tools.
// for whatever reason, the AppConfig type doesn't have this, so we'll add it ourselves.
(app.config as AppConfig & { devtools: boolean }).devtools = true;
app.mount("#app");
