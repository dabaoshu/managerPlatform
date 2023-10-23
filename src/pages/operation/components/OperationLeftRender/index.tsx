import classnames from 'classnames';
import { useHistory, useModel } from 'umi';
import styles from './index.less';
import { ClusterBadge } from '@/components/MenuRender/MenuHeader';
export const OperationLeftRender = () => {
  const [{ currentCluster }] = useModel('clusterModel');
  const history = useHistory();
  const routePush = (pathname) => {
    history.push({
      pathname,
    });
  };
  return (
    <div className={styles.title}>
      <div className={styles.flexbox}>
        {[
          {
            name: '总览',
            path: '/operation/overview',
          },
          {
            name: '节点',
            path: '/operation/nodes',
          },
        ].map((menu) => {
          return (
            <div
              key={menu.path}
              className={classnames(styles.menuItem, {
                [styles.selected]: location.pathname === menu.path,
              })}
              onClick={() => routePush(menu.path)}
            >
              {menu.name}
            </div>
          );
        })}
        <div className={styles.split}></div>
        <ClusterBadge item={currentCluster} />
      </div>
    </div>
  );
};
