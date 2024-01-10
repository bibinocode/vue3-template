import { defineConfig, loadEnv } from "vite";
import type { UserConfig, ConfigEnv } from "vite";
import { fileURLToPath } from "url";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import IconsResolvers from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElemtntPlus from "unplugin-element-plus/vite";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	/** 获取当前工作目录 */
	const root = process.cwd();
	/** 获取当前环境变量 */
	const env = loadEnv(mode, root);
	console.log(env);

	return {
		/** 项目根目录 */
		root,
		/** 项目部署的基础路径 */
		base: "/",
		/* 无需处理的静态资源位置 */
		publicDir: fileURLToPath(new URL("./public", import.meta.url)),
		/** 需要处理的静态资源位置 */
		assetsInclude: fileURLToPath(new URL("./src/assets", import.meta.url)),
		/** 插件 */
		plugins: [
			vue(),
			vueJsx(),
			// 开启ElementPlus自动引入CSS
			ElemtntPlus({}),
			// 自动引入组件及Icon
			AutoImport({
				resolvers: [IconsResolvers(), ElementPlusResolver()],
				// 自动生成类型文件
				dts: fileURLToPath(
					new URL("./types/auto-import.d.ts", import.meta.url),
				),
			}),
			// 自动注册组件
			Components({
				resolvers: [IconsResolvers(), ElementPlusResolver()],
				dts: fileURLToPath(
					new URL("./types/components.d.ts", import.meta.url),
				),
			}),
			// 自动安装图标
			Icons({
				autoInstall: true,
			}),
			// mock启用
			viteMockServe({
				// 如果接口为/mock/xxx 以mock开头 就会拦截响应配置的内容
				mockPath: "mock",
				enable: process.env.NODE_ENV === "development" ? true : false,
				logger: true,
			}),
		],
		/** 服务配置 */
		server: {
			/** 是否开启HTTPS */
			// https: {
			//   enableTrace: true
			// },
			/** 指定服务器监听那个IP地址 设置0.0.0.0 或者true将监听所有地址 */
			host: true,
			/** 开发环境预览服务器端口 */
			port: 3000,
			/** 启动后是否自动打开浏览器 */
			open: false,
			/** 是否开启CORS跨域 */
			cors: true,
			/** 代理服务器配置 */
			proxy: {
				/** 以/api 开头发送的请求都转发到本地 */
				[env.VITE_APP_API_BASEURL]: {
					target: "http://localhost:9000",
					// 改变Host Header
					changeOrigin: true,
					// 重写路径
					// rewrite:(path)=>path.replace(/^\/api/,"")
				},
				/** MOCK服务 */
				[env.VITE_APP_MOCK_BASEURL]: {
					target: "http://localhost:9000",
					changeOrigin: true,
					// rewrite:(path)=>path.replace(/^\/mock/,"")
				},
			},
		},
		/** 打包配置 */
		build: {
			/** 报错映射到源码 */
			sourcemap: true,
			/** 打包超过设置报警 */
			chunkSizeWarningLimit: 400,
			/** rollup 配置 */
			rollupOptions: {
				/** 打包入口 */
				input: {
					index: fileURLToPath(
						new URL("./index.html", import.meta.url),
					),
				},
				/** 输出配置 */
				output: {
					/** 转换模块 */
					format: "esm",
					/** 模块输出格式 */
					chunkFileNames: "static/js/[name]-[hash].js",
					/** 入口输出格式 */
					entryFileNames: "static/js/[name]-[hash].js",
					/** 资源输出 */
					assetFileNames: "static/[ext]/[name]-[hash].[ext]",
				},
			},
		},
		/** 解析配置 */
		resolve: {
			/** 路径别名 */
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				"#": fileURLToPath(new URL("./types", import.meta.url)),
			},
		},
	};
});
