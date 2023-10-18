import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { IRouteComponentProps } from 'umi';
import loginServer from '@/module/login.server';
import PageLoading from '@/components/PageLoading';

const CommonTokenLayout: React.FC<IRouteComponentProps> = ({ children, location, ...props }) => {
  const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (loginServer.iskeepLoginPage()) {
      return;
    }
    // 路由切换时没有currentUser的信息那就清除所有信息跳转到登录页
    if (!initialState?.currentUser && !loginServer.token) {
      loginServer.logout(false);
    } else if (initialState?.currentUser || loginServer.token) {
      setReady(true);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.pathname?.search]);

  if (loading || !ready) {
    return <PageLoading />;
  }
  return <>{children}</>;
};
export default CommonTokenLayout;
