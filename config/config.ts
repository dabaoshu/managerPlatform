import { defineConfig } from 'umi';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import getProxy from './proxy';
import routes from './routes';
import theme from './theme';
import metadata from 'monaco-editor/esm/metadata';
const { NODE_ENV, BASE = '/', PUBLIC_PATH = '/' } = process.env;

const ROUTER_BASE = BASE.lastIndexOf('/') === BASE.length - 1 ? BASE : `${BASE}/`;
// const outputDir = 'dist'; // Default: dist 不允许设定为 src、public、pages、mock、config 等约定目录
// const OUTPUT_PATH = PUBLIC_PATH !== '/' ? `${outputDir}${PUBLIC_PATH}` : outputDir;
const serverList = {
  "local": "http://localhost:10010",
  "dabaoshu": "http://dabaoshda5s4dau.top:6223",
  "154": 'http://172.21.72.154:8559',
  "116": 'http://10.45.46.116:8909',
  "1162": 'http://10.45.46.116:8910'
};

const target = serverList['1162']
const proxy = getProxy(NODE_ENV, target)

const define = {
  BASE,
  ROUTER_BASE,
  PUBLIC_PATH,
  // OUTPUT_PATH,
};

export default defineConfig({
  define,
  // base: ROUTER_BASE, // / 设置路由前缀，通常用于部署到非根目录。; 设置了OUTPUT_PATH可以不用再设置base hash模式图片路径没有问题
  publicPath: PUBLIC_PATH, // /
  hash: true,
  locale: {
    antd: true,
    //默认情况下，当前语言环境的识别按照：localStorage 中 umi_locale 值 > 浏览器检测 > default 设置的默认语言 > 中文
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  antd: false,
  dva: {
    hmr: true,
    // immer: true,
    // skipModelValidate: true,
    // disableModelsReExport: true,
    // lazyLoad: true,
  },
  layout: false,
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
  devtool: NODE_ENV === 'production' ? 'cheap-module-source-map' : 'eval',
  // devtool: NODE_ENV === 'production' ? 'source-map' : 'source-map',
  // devtool: 'eval',
  proxy,
  nodeModulesTransform: { type: 'none', exclude: [] },
  esbuild: {},
  // fastRefresh: {},
  webpack5: {},
  exportStatic: {},
  manifest: {
    basePath: '/',
  },
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // chainWebpack: webpackPlugin,
  // extraBabelPlugins: ['babel-plugin-react-require'],
  chunks: NODE_ENV !== 'development' ? ["react", "antdesigns", "lodash", 'umi', 'vendors'] : ["umi"],
  mfsu: {

  }, // 暂时屏蔽这个功能

  chainWebpack: function (config, { webpack, env }) {
    if (env !== 'development') {
      config.merge({
        optimization: {
          minimize: true,
          splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 3,
            automaticNameDelimiter: '.',
            cacheGroups: {
              react: {
                name: 'react',
                priority: 20,
                test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router)[\\/]/,
              },
              antdesigns: {
                name: 'antdesigns',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](antd|@ant-design|antd-mobile)/,
                priority: 10,
                enforce: true,
              },
              lodash: {
                name: 'lodash',
                test: /[\\/]node_modules[\\/]lodash[\\/]/,
                priority: -2,
                enforce: true,
              },
              vendors: {
                name: 'vendors',
                test({ resource }: any) {
                  return /[\\/]node_modules[\\/]/.test(resource)
                },
                priority: -11,
                enforce: true,
              },

            },
          },
        },
      });
    }
    config.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
      // 按需配置
      { languages: ["sql", "json"] }
    ]);
  },
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
