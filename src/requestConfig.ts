import { message, notification } from 'antd';
import type { RequestConfig } from 'umi';
import type { Context } from 'umi-request'
import { LOCAL_STORAGE, whiteApis } from './constants';
import loginServer from './module/login.server';
const formatMessage = () => ""
const httpCodeMsg = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

interface ErrorResp {
  name: string;
  data: any;
  type: string;
  response: Response;
}

const errorHandler = (error: ErrorResp): Response => {
  console.log('------error----------', error);
  if (error.name === 'BizError') {
    notification.error({
      message: `请求错误 ${error.data.code}`,
      description: error.data.msg,
    });
    return error.data.code;
  }
  const { response } = error;
  if (response?.status) {
    const errorText = httpCodeMsg[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    // message.error('您的网络或者服务器发生异常!');
    notification.error({
      message: '网络异常',
      description: '您的网络或者服务器发生异常!',
    });
  }
  throw error as any
};

// request拦截器, 改变url 或 options
const requestInterceptor = (url: string, options: RequestConfig) => {
  if (process.env.NODE_ENV === 'development' && window.__logger__) {
    console.log('url==>', url);
    if (options.data) {
      console.log('options.data==>', JSON.stringify(options.data));
    } else if (options.params && Object.keys(options.params).length > 0) {
      console.log('options.params==>', options.params);
    }
  }
  // 从initialState中获取也可以
  // Authorization: `bearer ${initialState?.auth?.[0]?.id_token}`,    // 这里获取自己的token携带在请求头上
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    [LOCAL_STORAGE.TOKEN]: loginServer.token || '',
    ...(options.headers || {})
  };

  if (options.download) {
    options.responseType = 'blob'; // download设置responseType
  }
  return {
    url: `${url}`,
    options: { ...options, headers },
  };
};

const whiteApiReqInterceptor = (url: string, options: RequestConfig) => {
  const headers = {
    ...(options.headers || {})
  };
  if (whiteApis.some((item) => url.indexOf(item) != -1)) {
    delete headers[LOCAL_STORAGE.TOKEN];
  }
  return {
    url: `${url}`,
    options: { ...options, headers },
  };
}



/**理论上这个只捕获有服务器且成功响应的 */
const responseInterceptor = async (response: Response, options: RequestConfig) => {
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('-----response--options---', options, response);
  // }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      loginServer.logout(false)
    }
    // else {

    // const errorText = httpCodeMsg[response.status] || response.statusText;
    // const { status, url } = response;
    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
    // }
  }
  return response
};

export const hocResponse = <T>(
  response: API.BaseResponse<T>,
  config: API.ResponseConfig = {
  }
) => {
  const { isShowSuccessTips, isShowErrorTips, localSuccessTips, localErrorTips } = {
    ... {
      isShowSuccessTips: false,
      isShowErrorTips: true,
      localSuccessTips: '',
      localErrorTips: '',
    },
    ...config
  }
  const { resultObject, resultMsg, resultCode }: API.BaseResponse<T> = response || {};

  const msgNewSuccess =
    localSuccessTips ||
    resultMsg ||
    formatMessage({ id: 'COMMON_COMMAND_SUCCESS', defaultMessage: '操作成功' });

  const msgNewError =
    localErrorTips || resultMsg || formatMessage({ id: 'COMMON_FAILED', defaultMessage: '失败' });
  // 雷电
  const isSuccess = `${resultCode}` === '0000';

  if (isSuccess && isShowSuccessTips) message.success(msgNewSuccess);
  if (!isSuccess && isShowErrorTips) message.error(msgNewError);

  return { isSuccess, code: resultCode, msg: resultMsg, data: resultObject };
};



const AdapterHandle = (res: {
  retCode: string;
  retMsg: string;
  entity: unknown;
}): API.BaseResponse<unknown> => {
  return {
    resultCode: res.retCode,
    resultMsg: res.retMsg,
    resultObject: res.entity
  }
}
type responseHandleOptions = {
  handleResp: boolean,
  ResponseConfig: API.ResponseConfig
}
const responseAdapterHandle = async <T>(ctx: Context, next: () => void) => {
  return (next as any)().then(() => {
    if (!ctx) return;
    if (ctx?.res?.retCode === "5020" || ctx?.res?.retCode === "5022") {
      loginServer.logout(false)
    }
    ctx.res = AdapterHandle(ctx?.res)
  })
};

const responseHandle = async <T>(ctx: Context, next: () => void) => {
  return (next as any)().then(() => {
    if (!ctx) return;
    const { handleResp = true, ResponseConfig = {} } = (ctx.req?.options || {}) as responseHandleOptions
    if (handleResp) {
      ctx.res = hocResponse(ctx?.res, ResponseConfig)
      if (window.__logger__) {
        console.log(ctx.res);
      }
    }
  })
};

// 统一的请求设定
export const requestConfig: RequestConfig = {
  // parseResponse:false,
  // credentials: 'include', //默认请求是否带上cookie
  // prefix: '',
  timeout: 60 * 1000,
  errorHandler,
  requestInterceptors: [requestInterceptor, whiteApiReqInterceptor],
  responseInterceptors: [responseInterceptor],
  middlewares: [responseHandle, responseAdapterHandle,]
};
