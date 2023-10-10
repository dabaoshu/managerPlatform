
export const PAGE_SIZE = 15;

export const NET_CONF = {
  TIMEOUT: 60 * 1000,
  BASE_API: '/api/v2/',
  WEBSOCKET_API: '/api/stomp/v1/websocket',
};

export const LOCAL_STORAGE = {
  TOKEN: 'X-Token', //修改老系统字段一致
  USERNAME: 'user', //用户token
  USER_INFO: 'user-info', //当前用户信息 TODO:
  CLUSTER_INFO: 'cluster-info', //当前集群信息
};

export const whiteUrls = ['/user/login', '/user/findpwd'];
export const whiteApis = [
  '/captchaController/captcha',
  '/login?', //要模糊匹配处理
  '/captchaController/phoneCaptcha',
  '/loginByPhone?', //要模糊匹配处理
];

export const BASE_URL_OLD = {
  Prefix: 'v1/',
  WEB: 'web0/', //老系统 web基本路径
  ADM: 'views/ADMIN_VIEW/2.0/INSTANCE/', //老系统 admin基本路径
};

