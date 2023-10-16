import {
  CheckCircleFilled,
  DownOutlined,
  LogoutOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Badge, Button, Divider, Popover, Space } from 'antd';
import { useMemo, useState } from 'react';
import styles from './index.less';
import { Link, useHistory, useModel } from 'umi';
import classnames from 'classnames';
import loginServer from '@/module/login.server';
// import ThreeHexagonsIcon from ''

const ClusterBadge = ({ className, active }) => {
  const { text, status } = useMemo(() => {
    return active ? { status: 'success', text: '运行中' } : { status: 'default', text: '失效' };
  }, [active]);

  return <Badge className={classnames(className)} status={status} text={text}></Badge>;
};

const ClusterItem = ({ item, active }) => {
  return (
    <div className={classnames(styles['cluster-item-box'])}>
      <div className={styles['cluster-item-current']}>
        {active && <CheckCircleFilled style={{ color: 'rgb(0, 180, 42)' }} />}
      </div>
      <div className={styles['cluster-item']}>
        <div className={styles['cluster-item-info']}>
          <div className={styles['cluster-item-info-name']}>{item.cluster}</div>
          <ClusterBadge active={true} className={styles['cluster-item-status']} />
        </div>
        <div className={styles['cluster-item-version']}>{item.version}</div>
      </div>
    </div>
  );
};

export default function MenuHeader(props) {
  const { title, logo } = props;
  const [open, setOpen] = useState(false);
  const [{ loadingEffects, clusterList, currentCluster }, { setState }] = useModel('clusterModel');
  console.log('clusterList', clusterList);

  const list = useMemo(() => {
    return clusterList.filter((clusterItem) => clusterItem.cluster !== currentCluster.cluster);
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
            {currentCluster.cluster && (
              <ClusterItem item={currentCluster} active={true}></ClusterItem>
            )}
            {list.map((o) => {
              return <ClusterItem key={o.cluster} item={o} active={false} />;
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
      <div className={classnames(styles.MenuHeader, { [styles['active']]: open })}>
        <div className={styles['logo']}>{logo}</div>
        <div className={styles['cluster-name']}>
          <div className={styles['text']}>{currentCluster.cluster}</div>
          <span className={styles['action-icon']}>{open ? <UpOutlined /> : <DownOutlined />}</span>
        </div>
      </div>
    </Popover>
  );
}
