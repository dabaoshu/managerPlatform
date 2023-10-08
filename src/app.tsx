import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import RightContent from '@/layouts/RightContent';
import Footer from '@/layouts/Footer';
import { getCurrentUserInfo } from './services/login';
import { requestConfig } from './requestConfig';
import loginServer from './module/login.server';
import layoutSettings from '../config/defaultSettings';
import type { LocalLayoutSettings } from '../config/defaultSettings';
// import defaultSettings from '../config/defaultSettings';
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
const fetchUserInfo = async () => {
  try {
    const res = await getCurrentUserInfo();
    return res.data;
  } catch (error) {
    loginServer.logout();
  }
  return undefined;
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  // currentUser?: API.CurrentUser;
  currentUser?: any;
  layoutSettings: LocalLayoutSettings;
}> {
  const InitialState = { currentUser: loginServer.currentUser, layoutSettings: layoutSettings };
  // 如果登录页面，直接输入/也不调接口 执行
  if (loginServer.iskeepLoginPage()) {
    return InitialState;
  } else if (loginServer.iskeepUserToken()) {
    const currentUser = await fetchUserInfo();
    return {
      ...InitialState,
      currentUser,
    };
  }
  return InitialState;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  console.log('initialState', initialState);

  return {
    disableContentMargin: false,
    rightContentRender: () => <RightContent />,
    waterMarkProps: {
      content: initialState?.currentUser?.userName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 路由切换时没有currentUser的信息那就清除所有信息跳转到登录页
      if (!initialState?.currentUser && !loginServer.iskeepLoginPage()) {
        loginServer.logout(false);
        // loginServer.logout();
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* 因部分历史问题，暂时先visibility处理下，保证发布出去的login页面也是统一主题色 */}
          {/* {isDev && !props.location?.pathname?.includes('/login') && ( */}
          {/* <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          /> */}
          {/* )} */}
        </>
      );
    },
    // ...defaultSettings,
    ...initialState?.layoutSettings,
  };
};

export const request = {
  ...requestConfig,
};
