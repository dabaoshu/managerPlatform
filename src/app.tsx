// import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
// import RightContent from '@/layouts/RightContent';
import Footer from '@/layouts/Footer';
import { requestConfig } from './requestConfig';
import loginServer from './module/login.server';
import defaultSettings from '../config/defaultSettings';
import type { LocalLayoutSettings } from '../config/defaultSettings';
import CollapsedButton from './layouts/MenuRender/CollapsedButton';
import MenuHeader from './layouts/MenuRender/MenuHeader';
// import defaultSettings from '../config/defaultSettings';
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
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

// // ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const { layoutSettings } = initialState;
  const onCollapse = (collapsed) => {
    setInitialState({
      ...initialState,
      layoutSettings: {
        ...layoutSettings,
        collapsed: !collapsed,
      },
    });
  };
  return {
    collapsed: layoutSettings.collapsed,
    onCollapse: (collapsed) => {
      onCollapse(collapsed);
    },
    disableContentMargin: false,
    rightContentRender: false,
    // actionsRender:
    waterMarkProps: {
      content: initialState?.currentUser?.userName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      console.log(initialState);
      // 路由切换时没有currentUser的信息那就清除所有信息跳转到登录页
      if (!initialState?.currentUser && !loginServer.token && !loginServer.iskeepLoginPage()) {
        loginServer.logout(false);
      }
    },
    collapsedButtonRender: (collapsed, dom) => {
      return <CollapsedButton collapsed={collapsed} onCollapse={onCollapse} />;
    },

    menuHeaderRender: (logo, title, props) => (
      <MenuHeader logo={logo} title={title} props={props} />
    ),
    onMenuHeaderClick: () => {},
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      return <>{children}</>;
    },
    // ...defaultSettings,
    ...layoutSettings,
  };
};

export const request = {
  ...requestConfig,
};
