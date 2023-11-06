import { useState } from 'react';
import styles from './index.less';
import { Table, Descriptions, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LeftOutlined, RightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { useModel } from 'umi';
import { useSetState } from 'ahooks';
import { TriggerModal } from '@/components/triggerModal';
import LogModal from './logModal';

interface Irecord {
  ip: string;
  cpu: string;
  disk: string;
  memory: string;
}

const ExpandAction = ({ children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.actionsMask}>
      <Space size={16}>
        <div
          className={classnames('cursor-pointer', styles.actionIcon)}
          onClick={() => setOpen(!open)}
        >
          {open ? <RightOutlined /> : <LeftOutlined />}
        </div>
        {open && children}
      </Space>
    </div>
  );
};

export default function NodeTable({ title, data = [], nodeType }) {
  const [{ currentCluster }] = useModel('clusterModel');
  const [{ loadingEffects }, { offlineClusterNode, onlineClusterNode }] =
    useModel('clusterRestart');
  const tableLoading = loadingEffects.offlineClusterNode || loadingEffects.onlineClusterNode;

  const handleActionClick = (type, record?: Irecord) => {
    switch (type) {
      case 'start':
      case 'reStart':
        onlineClusterNode({
          clusterName: currentCluster.clusterName,
          role: nodeType,
          ip: record?.ip,
        });
        break;
      case 'stop':
        onlineClusterNode({
          clusterName: currentCluster.clusterName,
          role: nodeType,
          ip: record?.ip,
        });
        break;
      case 'viewLog':
        break;

      default:
        break;
    }
  };

  const columns: ColumnsType<Irecord> = [
    { title: 'IP', dataIndex: 'ip', key: 'ip' },
    { title: '角色', dataIndex: 'hostname', key: 'hostname' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '内存利用率', dataIndex: 'memoryUsage', key: 'memoryUsage' },
    { title: 'CPU 利用率', dataIndex: 'cpuUsage', key: 'cpuUsage' },
    { title: '磁盘利用率', dataIndex: 'diskUsage', key: 'diskUsage' },
    { title: '磁盘 IO Util', dataIndex: 'diskIO', key: 'diskIO' },
    { title: '网络下载速率', dataIndex: 'networkDown', key: 'networkDown' },
    { title: '网络上传速率', dataIndex: 'networkUp', key: 'networkUp' },
    {
      className: styles.actions,
      dataIndex: 'xx',
      key: 'x',
      render: (v, r) => (
        <ExpandAction>
          <Popconfirm
            title={`确认启动${title} ${r.ip}`}
            onConfirm={() => handleActionClick('start', r)}
            // icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <a>启动</a>
          </Popconfirm>
          <Popconfirm
            title={`确认停止${title} ${r.ip}`}
            onConfirm={() => handleActionClick('stop', r)}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <a>停止</a>
          </Popconfirm>
          <Popconfirm
            title={`确认重启${title} ${r.ip}`}
            onConfirm={() => handleActionClick('reStart', r)}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <a>重启</a>
          </Popconfirm>
          <LogModal
            title={`${title} ${r.ip}日志`}
            trigger={<a>查看日志</a>}
            role={nodeType}
            ip={r.ip}
          />
        </ExpandAction>
      ),
    },
  ];
  return (
    <section className={styles.nodeTable}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div>
          <Space size={16}>
            <Popconfirm
              title={`确认停止${title}`}
              onConfirm={() => handleActionClick('stop-node')}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <a>重启</a>
            </Popconfirm>
            <Popconfirm
              title={`确认停止${title}`}
              onConfirm={() => handleActionClick('restart-node')}
              icon={<QuestionCircleOutlined style={{ color: 'blue' }} />}
            >
              <a> 停止</a>
            </Popconfirm>
          </Space>
        </div>
      </div>
      <div>
        <Table
          loading={tableLoading}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div className={styles.expandedRowRender}>
                  <Descriptions
                    column={4}
                    className={styles.baseDesc}
                    layout="vertical"
                    items={[
                      {
                        key: '1',
                        label: 'CPU',
                        style: {
                          width: '33%',
                        },

                        children: record.cpu,
                      },
                      {
                        key: '2',
                        label: '内存',
                        children: record.memory,
                      },
                      {
                        key: '3',
                        label: '硬盘',
                        children: record.disk,
                      },
                    ]}
                  />
                </div>
              );
            },
          }}
          dataSource={data}
          pagination={false}
        />
      </div>
    </section>
  );
}
