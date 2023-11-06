import { CheckCircleFilled, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Divider, Popover, Space, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import styles from './index.less';
import { Link, useModel } from 'umi';
import classnames from 'classnames';
import loginServer from '@/module/login.server';
import ExpandIcon from '@/components/expandIcon';
// import ThreeHexagonsIcon from ''

export const ClusterBadge = ({ className = '', item }) => {
  const { text, status } = useMemo(() => {
    const active = !!item;
    return active ? { status: 'success', text: '运行中' } : { status: 'default', text: '失效' };
  }, [item]);

  return <Badge className={classnames(className)} status={status} text={text} />;
};

const ClusterItem = ({ item, active, onClick = () => {} }) => {
  return (
    <div className={classnames(styles['cluster-item-box'])} onClick={onClick}>
      <div className={styles['cluster-item-current']}>
        {active && <CheckCircleFilled style={{ color: 'rgb(0, 180, 42)' }} />}
      </div>
      <div className={styles['cluster-item']}>
        <div className={styles['cluster-item-info']}>
          <div className={styles['cluster-item-info-name']}>{item.clusterName}</div>
          <ClusterBadge item={item} className={styles['cluster-item-status']} />
        </div>
        <div className={styles['cluster-item-version']}>
          {item.packageName}-{item.packageVersion}
        </div>
      </div>
    </div>
  );
};

export default function MenuHeader(props) {
  const {
    title,
    logo,
    props: { collapsed },
  } = props;

  const [open, setOpen] = useState(false);
  const [{ loadingEffects, clusterList, currentCluster }, { switchCluster }] =
    useModel('clusterModel');
  const list = useMemo(() => {
    return clusterList.filter(
      (clusterItem) => clusterItem.clusterName !== currentCluster.clusterName,
    );
  }, [clusterList, currentCluster]);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const PopoverContent = () => {
    const logout = () => {
      loginServer.logout(false);
      hide();
    };
    return (
      <div className={styles.popoverContent}>
        <div className={styles['cluster-box']}>
          <div className={styles['cluster-list']}>
            {currentCluster.clusterName && <ClusterItem item={currentCluster} active={true} />}
            {list.map((o) => {
              return (
                <ClusterItem
                  key={o.clusterName}
                  onClick={() => switchCluster(o)}
                  item={o}
                  active={false}
                />
              );
            })}
          </div>
          <Divider style={{ margin: '8px 12px' }} />

          <Link to={'/new'} onClick={hide} className={styles.action}>
            <Space size={12}>
              <PlusOutlined />
              <div>新建 / 接管集群</div>
            </Space>
          </Link>
          <div onClick={logout} className={styles.action}>
            <Space size={12}>
              <LogoutOutlined />
              <div>退出登录</div>
            </Space>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover
      content={<PopoverContent />}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      overlayStyle={{
        width: '320px',
      }}
      overlayInnerStyle={{
        padding: 0,
      }}
      arrow={false}
    >
      <Tooltip title={currentCluster?.clusterName ? `当前集群:${currentCluster?.clusterName}` : ''}>
        <div
          className={classnames(styles.MenuHeader, {
            [styles.active]: open,
            [styles.collapsed]: collapsed,
          })}
        >
          <div className={styles.logo}>{logo}</div>
          {!collapsed && (
            <div className={styles['cluster-name']}>
              <div className={styles.text}>{currentCluster?.clusterName}</div>
              <ExpandIcon open={open} />
            </div>
          )}
        </div>
      </Tooltip>
    </Popover>
  );
}
