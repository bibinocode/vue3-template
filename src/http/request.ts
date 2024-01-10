import axios, {
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import { getMessageInfo } from "./status";
import { ElMessage } from "element-plus";

export interface BaseResponse<T = any> {
	code: number | string;
	data: T;
	message: string;
}

const getBaseUrl = () =>
	import.meta.env.VITE_APP_USE_MOCK
		? import.meta.env.VITE_APP_MOCK_BASEURL
		: import.meta.env.VITE_APP_API_BASEURL;
const instance = axios.create({
	baseURL: getBaseUrl(),
	timeout: 15000,
});

instance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response: AxiosResponse) => {
		if (response.status === 200) {
			return response;
		}
		ElMessage({
			message: getMessageInfo(response.status),
			type: "error",
		});
		return response;
	},
	(error: any) => {
		const { response } = error;
		// 请求已发出，但不在2xx范围
		if (response) {
			ElMessage({
				message: getMessageInfo(response.status),
				type: "error",
			});
			return Promise.reject(response.data);
		}
		// 其余情况
		ElMessage({
			message: "网络异常,请稍后再试!",
			type: "error",
		});
	},
);

/** 二次拦截处理 */
const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
	const cof = config;
	return new Promise((resolve, reject) => {
		instance
			.request<any, AxiosResponse<BaseResponse>>(cof)
			.then((res: AxiosResponse<BaseResponse>) => {
				const data = res.data;
				if (data.code != 1) {
					ElMessage({
						message: data.message,
						type: "error",
					});
					reject(data.message);
				} else {
					ElMessage({
						message: data.message,
						type: "success",
					});
					resolve(data.data as T);
				}
			});
	});
};

/** GET请求方式 */
export function get<T = any, U = any>(
	config: AxiosRequestConfig,
	url: string,
	params?: U,
): Promise<T> {
	return requestInstance({
		...config,
		url,
		method: "GET",
		params,
	});
}

/** POST请求方式 */
export function post<T = any, U = any>(
	config: AxiosRequestConfig,
	url: string,
	data: U,
): Promise<T> {
	return requestInstance({
		...config,
		url,
		method: "POST",
		data,
	});
}

export default instance;
