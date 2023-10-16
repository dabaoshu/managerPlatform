
export const PAGE_SIZE = 15;

export const NET_CONF = {
  TIMEOUT: 60 * 1000,
  BASE_API: '/api/v2/',
  WEBSOCKET_API: '/api/stomp/v1/websocket',
};

export const LOCAL_STORAGE = {
  TOKEN: 'Token',
  USERNAME: 'user', //用户token
  USER_INFO: 'user-info', //当前用户信息 TODO:
  CLUSTER_INFO: 'cluster-info', //当前集群信息
};

export const whiteApis = [
  '/captchaController/captcha',
  '/login?', //要模糊匹配处理
  '/captchaController/phoneCaptcha',
  '/loginByPhone?', //要模糊匹配处理
];



