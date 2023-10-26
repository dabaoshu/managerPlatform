import classnames from 'classnames';
import { useHistory, useLocation } from 'umi';
import styles from './index.less';
export const MonitorLeftRender = () => {
  const history = useHistory();
  const location = useLocation();
  const routePush = (pathname) => {
    if (location.pathname.indexOf(pathname) !== 0) {
      history.push({
        pathname,
      });
    }
  };
  return (
    <div className={styles.title}>
      <div className={styles.flexbox}>
        {[
          {
            name: '监控',
            path: '/monitor/dashboard',
          },
          {
            name: '告警',
            path: '/monitor/alarm',
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
      </div>
    </div>
  );
};
