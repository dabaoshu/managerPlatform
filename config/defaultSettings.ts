import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import type { Settings as LayoutSettings } from '@ant-design/pro-components';

// 我们可以在 config/config.ts 中配置 favicon ，支持配置多个 favicon 文件。配置 favicons 路径，可以是绝对路径，也可以是基于项目根目录的相对路径。比如：
// favicons: ['/assets/favicon.ico']

export type LocalLayoutSettings = LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  logoIcon?: string;
  slogan?: string;
}

const layoutSettings: LocalLayoutSettings = {
  logoIcon: './logo.png',
  logo: './logo-head.png',
  title: '浩鲸大数据平台', //产品名，默认值为包名。
  slogan: '基于云原生、物理机等环境下,构建业界主流hadoop大数据平台', //另外加的
  iconfontUrl: '',
  navTheme: 'light',
  primaryColor: '#156DF9',
  // primaryColor: '#00C1DE',
  // colorPrimary: '#00C1DE',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  // menuRender: false,
  // footerRender: false,
  // headerRender: false,
};

export default layoutSettings;
