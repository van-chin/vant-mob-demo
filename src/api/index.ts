import { createAlova } from "alova";
import VueHook from "alova/vue";
import adapterFetch from "alova/fetch";

import { StorageSerializers, useStorage } from "@vueuse/core";
import { axiosRequestAdapter } from "@alova/adapter-axios";

import {
  closeToast,
  showConfirmDialog,
  showFailToast,
  showLoadingToast,
  showSuccessToast,
  showToast,
} from "vant";

import request from "@/utils/request";

// user alova instance
export const lanhiAlova = createAlova({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),

  beforeRequest: (method) => {
    // console.info("beforeRequest method =>", method);
    const tokenJwtkeyAcc = useStorage("TOKEN-JWTKEY-ACC", {
      token: "",
      jwtkey: "",
      caccid: "",
    });

    const { token, jwtkey } = tokenJwtkeyAcc.value;

    method.config.headers.Authorization = `Bearer ${token}`;
    method.config.headers.jwtkey = jwtkey;
    method.config.headers["Content-Type"] = "application/x-www-form-urlencoded";
  },
  responded: {
    onSuccess: async (response, method) => {
      // console.info("onSuccess response =>", response);

      const { status, data: responseData } = response;
      // console.info("onSuccess status =>", status);
      // console.info("onSuccess responseData =>", responseData);

      if (status === 200) {
        // console.info('responseData xxxxx =>', responseData);
        const { code, data, info } = responseData;
        // console.info('code =>',code);
        // console.info("data =>", data);
        // console.info('info =>',info);

        switch (code) {
          case 400:
            // console.info('业务发生错误了 ===>',info);

            showToast(info);

            break;

          default:
          // console.info('code =>',code);
          // console.info("业务正常 返回数据");

          // 无匹配时的默认分支
        }

        return data;
      }
    },

    onError: (error, method) => {
      // console.info("onError error =>", error);
      // console.info("onError method =>", method);
    },
    onComplete: async (method) => {
      // 处理请求完成逻辑
      // console.info('onComplete method =>',method);
    },
  },
});

// order alova instance
// export const orderAlova = createAlova({
//   baseURL: "https://api-order.alovajs.org",
//   statesHook: VueHook,
//   requestAdapter: adapterFetch(),
//   async responded(method) {
//     method.config.headers.token = "order token";
//   },
// });

// upload alova instance
// export const uploadAlova = createAlova({
//   baseURL: "https://api-order.alovajs.org",
//   statesHook: VueHook,
//   requestAdapter: axiosRequestAdapter(),
// });

export async function queryProse(): Promise<any> {
  return request("/prose");
}
