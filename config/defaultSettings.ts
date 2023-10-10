import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { theme } from 'antd';

const { getDesignToken } = theme;

export const token = getDesignToken({ token: { colorPrimary: '#0065fd' } });

// import type { Settings as LayoutSettings } from '@ant-design/pro-components';

// 我们可以在 config/config.ts 中配置 favicon ，支持配置多个 favicon 文件。配置 favicons 路径，可以是绝对路径，也可以是基于项目根目录的相对路径。比如：
// favicons: ['/assets/favicon.ico']
// colorPrimaryText
// :
// "#0065fd"
// colorPrimaryTextActive
// :
// "#004fd6"
// colorPrimaryTextHover
// :
// "#2986ff"
export const layoutToken = {
  sider: {
    colorMenuBackground: '#F8FBFFD9',
    radiusItem: 4,
    menuHeight: token.controlHeightLG,
    colorBgMenuItemSelected: '#dce8fc',
    colorBgMenuItemHover: '#dce8fc',
    colorBgMenuItemActive: '#dce8fc',
    colorActiveBarWidth: 0,
    colorActiveBarHeight: 0,
    colorActiveBarBorderSize: 0,
    colorTextMenuItemHover: token.colorPrimary,
    colorTextMenuSelected: token.colorPrimary,
    colorTextMenuActive: token.colorPrimary,
    colorBgMenuItemCollapsedElevated: '#fff',
  },
};

export type LocalLayoutSettings = LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  logoIcon?: string;
  slogan?: string;
  collapsed?: boolean;
};

const layoutSettings: LocalLayoutSettings = {
  logoIcon: './logo.png',
  logo: './logo-head.png',
  title: '浩鲸大数据平台', //产品名，默认值为包名。
  slogan: '基于云原生、物理机等环境下,构建业界主流hadoop大数据平台', //另外加的
  iconfontUrl: '',
  navTheme: 'light',
  colorPrimary: '#0065fd',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  collapsed: false,
  // menuRender: false,
  // footerRender: false,
  headerRender: false,
  token: layoutToken,
};

export default layoutSettings;
