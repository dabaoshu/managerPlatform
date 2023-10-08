import { join } from 'path';
import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import getProxy from './proxy';
import routes from './routes';
import theme from './theme';

const { NODE_ENV, BASE = '/', PUBLIC_PATH = '/' } = process.env;
console.log("-----NODE_ENV, BASE = '/', PUBLIC_PATH--------", NODE_ENV, BASE, PUBLIC_PATH);
const isPro = NODE_ENV === 'production';

const ROUTER_BASE = BASE.lastIndexOf('/') === BASE.length - 1 ? BASE : `${BASE}/`;
const outputDir = 'dist'; // Default: dist 不允许设定为 src、public、pages、mock、config 等约定目录
const OUTPUT_PATH = PUBLIC_PATH !== '/' ? `${outputDir}${PUBLIC_PATH}` : outputDir;
const serverList = {
  "local": "http://localhost:10010",
};

const target = serverList['local']
const proxy = getProxy(NODE_ENV, target)

const define = {
  isPro,
  BASE,
  ROUTER_BASE,
  PUBLIC_PATH,
  OUTPUT_PATH,
  STOMP_URL: isPro ? '/' : target,
};
console.log('---define---', JSON.stringify(define));

export default defineConfig({
  define,
  // base: ROUTER_BASE, // / 设置路由前缀，通常用于部署到非根目录。; 设置了OUTPUT_PATH可以不用再设置base hash模式图片路径没有问题
  publicPath: PUBLIC_PATH, // /
  outputPath: OUTPUT_PATH, // dist/
  hash: true,
  locale: {
    antd: true,
    //默认情况下，当前语言环境的识别按照：localStorage 中 umi_locale 值 > 浏览器检测 > default 设置的默认语言 > 中文
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,

  },
  antd: {
    // dark: true, // 开启暗色主题
    compact: true, // 开启紧凑主题
    // dark: true, // 开启暗色主题
    // compact: true, // 开启紧凑主题
    // config: {
    //   prefixCls: 'bdp',
    // },
  },
  dva: {
    hmr: true,
    // immer: true,
    // skipModelValidate: true,
    // disableModelsReExport: true,
    // lazyLoad: true,
  },
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  title: false,
  ignoreMomentLocale: true,
  // targets: {
  //   ie: 11, //还要考虑antd及dva相关插件是否支持
  // },
  routes,
  theme,
  // lessLoaderOptions: {
  //   javascriptEnabled: true,
  // },
  // devtool: NODE_ENV === 'production' ? 'cheap-module-source-map' : 'eval',
  devtool: isPro ? 'source-map' : 'source-map',
  // devtool: 'eval',
  proxy,
  nodeModulesTransform: { type: 'none', exclude: [] },
  esbuild: {},
  fastRefresh: {},
  mfsu: {}, // 暂时屏蔽这个功能
  webpack5: {},
  exportStatic: {},
  manifest: {
    basePath: '/',
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // chainWebpack: webpackPlugin,
  // extraBabelPlugins: ['babel-plugin-react-require'],
  // chunks: ['vendors', 'umi'],
  // chainWebpack: function (config, { webpack }) {
  //   config.merge({
  //     optimization: {
  //       splitChunks: {
  //         chunks: 'all',
  //         minSize: 30000,
  //         minChunks: 3,
  //         automaticNameDelimiter: '.',
  //         cacheGroups: {
  //           vendor: {
  //             name: 'vendors',
  //             test({ resource }) {
  //               return /[\\/]node_modules[\\/]/.test(resource);
  //             },
  //             priority: 10,
  //           },
  //         },
  //       },
  //     },
  //   });
  // },
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本 schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    // {
    //   requestLibPath: "import { request } from 'umi'",
    //   schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
    //   projectName: 'swagger',
    // },
  ],
  // qiankun: {
  //   master: {
  //     apps: [
  //       {
  //         name: 'user',
  //         entry: 'http://localhost:8001',
  //       },
  //     ],
  //   },
  // },

  // request: {
  //   dataField: 'data',
  // },
});
