import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import nprogress from "nprogress";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: () => import("@/views/home/index.vue"),
		meta: {},
		children: [],
	},
];

/** 模块导入 默认为懒加载模式 加入配置项 eager 取消懒加载 */

const modules: Record<string, any> = import.meta.glob(["./modules/*.ts"], {
	eager: true,
});
Object.keys(modules).forEach((key) => {
	routes.push(modules[key].default);
});

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

router.beforeEach((_to, _from, next) => {
	nprogress.start();
	next();
});

router.afterEach(() => {
	nprogress.done();
});

export default router;
