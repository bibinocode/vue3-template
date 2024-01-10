import { createPinia } from "pinia";
import piniasistedPlugin from "pinia-plugin-persistedstate";

/** 导出pinia */
const pinia = createPinia();
pinia.use(piniasistedPlugin);

export default pinia;
