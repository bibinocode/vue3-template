import { createApp } from "vue";
import router from "./router";
import pinia from "./store";
import App from "./views/App.vue";
import "./styles/reset.css";

const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount("#app");
