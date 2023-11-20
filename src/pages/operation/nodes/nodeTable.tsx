import { useState } from 'react';
import styles from './index.less';
import { Table, Descriptions, Space, Popconfirm, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LeftOutlined, RightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { useModel } from 'umi';
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
const colorStatusMap = {
  green: { status: 'success', text: '健康' },
  red: { status: 'error', text: '离线' },
  yellow: { status: 'warning', text: '亚健康' },
};

const ColorBudge = ({ color }) => {
  const { status, text } = colorStatusMap[color];
  return <Badge status={status} text={text} />;
};

export default function NodeTable({ title, data = [], nodeType }) {
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const [{ loadingEffects }, { offlineClusterNode, onlineClusterNode }] =
    useModel('clusterRestart');
  const tableLoading = loadingEffects.offlineClusterNode || loadingEffects.onlineClusterNode;

  const handleActionClick = (type, record?: Irecord) => {
    switch (type) {
      /**节点下的ip */
      case 'ip-start':
      case 'ip-reStart':
        onlineClusterNode({
          clusterName,
          role: nodeType,
          ip: record?.ip,
        });
        break;
      case 'ip-stop':
        offlineClusterNode({
          clusterName,
          role: nodeType,
          ip: record?.ip,
        });
        break;
      case 'viewLog':
        break;
      /**节点 */
      case 'node-reStart':
        onlineClusterNode({
          clusterName,
          role: nodeType,
          ip: '',
        });
        break;
      case 'node-stop':
        offlineClusterNode({
          clusterName,
          role: nodeType,
        });
        break;
      default:
        break;
    }
  };

  const columns: ColumnsType<Irecord> = [
    { title: 'IP', dataIndex: 'ip', key: 'ip' },
    { title: '角色', dataIndex: 'hostname', key: 'hostname' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v) => {
        return <ColorBudge color={v} />;
      },
    },
    { title: '内存利用率', dataIndex: 'memoryUsage', key: 'memoryUsage' },
    { title: 'CPU 利用率', dataIndex: 'cpuUsage', key: 'cpuUsage' },
    { title: '磁盘利用率', dataIndex: 'diskUsage', key: 'diskUsage' },
    { title: '磁盘 IO Util', dataIndex: 'diskIO', key: 'diskIO' },
    { title: '网络下载速率', dataIndex: 'networkDown', key: 'networkDown' },
    { title: '网络上传速率', dataIndex: 'networkUp', key: 'networkUp' },
    {
      className: styles.actions,
      dataIndex: 'oper',
      key: 'oper',
      render: (v, r) => (
        <ExpandAction>
          <Popconfirm
            title={`确认启动${title} ${r.ip}`}
            onConfirm={() => handleActionClick('ip-start', r)}
          >
            <a>启动</a>
          </Popconfirm>
          <Popconfirm
            title={`确认停止${title} ${r.ip}`}
            onConfirm={() => handleActionClick('ip-stop', r)}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <a>停止</a>
          </Popconfirm>
          <Popconfirm
            title={`确认重启${title} ${r.ip}`}
            onConfirm={() => handleActionClick('ip-reStart', r)}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <a>重启</a>
          </Popconfirm>
          <LogModal
            title={`${title} ${r.ip}日志`}
            trigger={<a>查看日志</a>}
            role={nodeType}
            ip={r.ip}
            clusterName={clusterName}
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
              onConfirm={() => handleActionClick('node-stop')}
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <a>停止</a>
            </Popconfirm>
            <Popconfirm
              title={`确认重启${title}`}
              onConfirm={() => handleActionClick('node-reStart')}
              icon={<QuestionCircleOutlined style={{ color: 'blue' }} />}
            >
              <a>重启</a>
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
                        key: 'cpu',
                        label: 'CPU',
                        style: {
                          width: '33%',
                        },
                        children: record.cpu,
                      },
                      {
                        key: 'memory',
                        label: '内存',
                        children: record.memory,
                      },
                      {
                        key: 'disk',
                        label: '硬盘',
                        children: record.disk,
                      },
                    ]}
                  />
                </div>
              );
            },
          }}
          size="small"
          rowKey={'ip'}
          dataSource={data}
          pagination={false}
        />
      </div>
    </section>
  );
}
