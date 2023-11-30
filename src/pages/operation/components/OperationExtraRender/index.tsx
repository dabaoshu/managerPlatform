import ExpandIcon from '@/components/expandIcon';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Modal, Popconfirm, Menu, Popover } from 'antd';
import { useHistory } from 'react-router';
import styles from './index.less';
import { useSetState } from 'ahooks';
import { useModel } from 'umi';
import { ModalPrompt } from '@/utils/prompt';

const restartNodes = [
  // {
  //   title: '集群',
  //   key: 'cluster',
  //   type: 'cluster',
  // },
  // {
  //   title: 'server',
  //   key: 'server',
  //   type: 'node',
  // },
  // {
  //   title: 'tso',
  //   key: 'tso',
  //   type: 'node',
  // },
  // {
  //   title: 'Resourcemanager',
  //   key: 'resourcemanager',
  //   type: 'node',
  // },
  // {
  //   title: 'Daemonmanager',
  //   key: 'daemon',
  //   type: 'node',
  // },
  {
    title: '读worker',
    key: 'worker',
    type: 'node',
  },
  {
    title: '写worker',
    key: 'worker-write',
    type: 'node',
  },
  // {
  //   title: 'Fdb元数据',
  //   key: 'fdb',
  //   type: 'node',
  // },
];

export const OperationExtraRender = () => {
  const [{ hiddenMsg, hiddenMsgOpen }, { onlineClusterNode }] = useModel('clusterRestart');
  const [{ currentCluster }] = useModel('clusterModel');

  const history = useHistory();
  const [{ cluserRestartMenuOpen }, setState] = useSetState({
    cluserRestartMenuOpen: false,
  });
  const routePush = (pathname) => {
    history.push({
      pathname,
    });
  };

  const handleMenuClick = ({ key, ...i }) => {
    console.log({ key, ...i });

    switch (key) {
      case 'parameter':
        routePush('/operation/parameter');
        break;
      case 'clusterUpdate':
        ModalPrompt({
          props: { title: '集群升级' },
          component: () => <div>111</div>,
          data: {},
        });
        break;

      default:
        break;
    }
  };

  const handleRestart = (item) => {
    // 重启集群
    if (item.type === 'cluster') {
      onlineClusterNode({ clusterName: currentCluster.clusterName });
    } else {
      onlineClusterNode({ clusterName: currentCluster.clusterName, role: item.key });
    }
  };

  const handleScaling = (item) => {
    routePush(`/operation/scaling/${item.key}`);
  };

  return (
    <>
      <Space className={styles.ExtraRender}>
        <Dropdown
          arrow={false}
          trigger={['click']}
          menu={{
            items: [
              { key: 'parameter', label: '参数配置' },
              { key: '2', label: '停止 Broker' },
              { key: 'clusterUpdate', label: '集群升级' },
            ],
            onClick: handleMenuClick,
          }}
        >
          <Button className={styles.EllipsisBtn} icon={<EllipsisOutlined />} />
        </Dropdown>

        <Popover
          rootClassName={styles.cluserRestarPopover}
          placement="bottomLeft"
          content={
            <div className={styles.menu}>
              {restartNodes.map((o) => {
                if (o.type === 'node') {
                  return (
                    <>
                      <div
                        className={styles.menuItem}
                        key={o.key}
                        onClick={() => {
                          handleScaling(o);
                        }}
                      >
                        {o.key} 管理
                      </div>
                    </>
                  );
                }
              })}
            </div>
          }
          trigger="click"
        >
          <Button>
            集群伸缩
            <ExpandIcon className={styles.ml8} />
          </Button>
        </Popover>

        <Popover
          rootClassName={styles.cluserRestarPopover}
          arrow={false}
          placement="bottomLeft"
          content={
            <div className={styles.menu}>
              {restartNodes.map((o) => {
                return (
                  <Popconfirm
                    key={o.key}
                    onConfirm={() => {
                      handleRestart(o);
                      setState({ cluserRestartMenuOpen: false });
                    }}
                    placement="left"
                    title={`确认是否重启`}
                  >
                    <div className={styles.menuItem}>重启 {o.title}</div>
                  </Popconfirm>
                );
              })}
            </div>
          }
          trigger="click"
          open={cluserRestartMenuOpen}
          onOpenChange={(o) => {
            setState({ cluserRestartMenuOpen: o });
          }}
        >
          <Button>
            重启
            <ExpandIcon className={styles.ml8} />
          </Button>
        </Popover>
      </Space>
    </>
  );
};
