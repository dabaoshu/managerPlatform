/*
 * @author: samy
 * @email: yessz#foxmail.com
 * @time: 2022-10-17 16:53:21
 * @modAuthor: samy
 * @modTime: 2023-02-21 13:41:45
 * @desc:
 * Copyright © 2015~2022 BDP FE
 */
declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';

declare const isPro: boolean;
declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
declare const ROUTER_BASE: string;
declare const STOMP_URL: string;

// 前端开发很大程度上就是与 Window 打交道，有时候我们不得不给 Window 增加参数，例如各种统计的代码。在 TypeScript 中提供一个方式来增加参数。在 /src/typings.d.ts 中做如下定义：
interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
  __logger__: boolean // 调试接口
}


