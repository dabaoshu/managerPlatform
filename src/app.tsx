import type { RunTimeLayoutConfig } from 'umi';
// import RightContent from '@/layouts/RightContent';
import { requestConfig } from './requestConfig';
import loginServer from './module/login.server';
import defaultSettings from './layouts/defaultSettings';
import type { LocalLayoutSettings } from './layouts/defaultSettings';

import PageLoading from './components/PageLoading';

// import defaultSettings from '../config/defaultSettings';
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading tip="initialStateConfig" />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  // currentUser?: API.CurrentUser;
  currentUser?: any;
  layoutSettings: LocalLayoutSettings;
}> {
  const InitialState = { currentUser: loginServer.currentUser, layoutSettings: defaultSettings };
  // 如果登录页面，直接输入/也不调接口 执行
  if (loginServer.iskeepLoginPage()) {
    return InitialState;
  } else if (loginServer.iskeepUserToken()) {
    // const currentUser = await fetchUserInfo();
    return {
      ...InitialState,
      // currentUser,
    };
  }
  return InitialState;
}

// // // ProLayout 支持的api https://procomponents.ant.design/components/layout
// export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
//   const { layoutSettings } = initialState;
//   const onCollapse = (collapsed) => {
//     setInitialState({
//       ...initialState,
//       layoutSettings: {
//         ...layoutSettings,
//         collapsed: !collapsed,
//       },
//     });
//   };

//   return {
//     collapsed: layoutSettings.collapsed,
//     onCollapse: (collapsed) => {
//       onCollapse(collapsed);
//     },
//     // loading: true,
//     disableContentMargin: false,
//     rightContentRender: false,
//     // actionsRender:
//     waterMarkProps: {
//       content: initialState?.currentUser?.userName,
//     },
//     footerRender: () => <Footer />,
//     onPageChange: (location) => {
//       console.log('onPageChange', location, initialState);
//       /** 登录相关页不做token校验*/
//       if (loginServer.iskeepLoginPage()) {
//         return;
//       }
//       // 路由切换时没有currentUser的信息那就清除所有信息跳转到登录页
//       if (!initialState?.currentUser && !loginServer.token) {
//         loginServer.logout(false);
//       } else if (initialState?.currentUser || loginServer.token) {
//       }
//     },
//     collapsedButtonRender: (collapsed, dom) => {
//       return <CollapsedButton collapsed={collapsed} onCollapse={onCollapse} />;
//     },
//     menuHeaderRender: (logo, title, props) => (
//       <MenuHeader logo={logo} title={title} props={props} />
//     ),
//     onMenuHeaderClick: () => {},

//     // 增加一个 loading 的状态
//     childrenRender: (children, props) => {
//       return children;
//     },
//     contentStyle: {
//       padding: 0,
//       height: '100%',
//       overflow: 'auto',
//     },
//     // ...defaultSettings,
//     ...layoutSettings,
//   };
// };

export const request = {
  ...requestConfig,
};
