// import type { RunTimeLayoutConfig } from 'umi';
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

export const request = {
  ...requestConfig,
};
