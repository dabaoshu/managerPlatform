
export const PAGE_SIZE = 15;

export const NET_CONF = {
  TIMEOUT: 60 * 1000,
  BASE_API: '/api/v2/',
  WEBSOCKET_API: '/api/stomp/v1/websocket',
};

export const LOCAL_STORAGE = {
  TOKEN: 'Token',
  USERNAME: 'user', //用户token
  HIDDEN_MSG: "hidden-msg"
};

export const whiteApis = [
  '/captchaController/captcha',
  '/login?', //要模糊匹配处理
  '/captchaController/phoneCaptcha',
  '/loginByPhone?', //要模糊匹配处理
];



