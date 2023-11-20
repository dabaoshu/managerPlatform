import { FileTextOutlined } from '@ant-design/icons';
import { Badge, Space, Tooltip } from 'antd';
import styles from './index.less';
export const nodeTypes = [
  {
    title: 'server',
    key: 'serverNodes',
  },
  {
    title: 'tso',
    key: 'tsoNodes',
  },
  {
    title: 'resourcemanager',
    key: 'resourceManagerNodes',
  },
  {
    title: 'daemonmanager',
    key: 'daemonManagerNodes',
  },
  {
    title: '读worker',
    key: 'workerNodes',
  },
  {
    title: '写worker',
    key: 'workerWriteNodes',
  },
  {
    title: 'fdb元数据',
    key: 'fdbNodes',
  },
  {
    title: 'hdfs',
    key: 'hdfshost',
  },
];
// server/tso/resourcemanager/daemon/worker/worker-write/fdb

export const statusMap = {
  '0': { text: '节点状态正常', status: 'success' },
  '1': { text: '节点连接超时', status: 'error' },
  '2': { text: '密码错误', status: 'error' },
  '3': { text: '服务拒绝连接', status: 'error' },
  default: { text: '待检测', status: 'default' },
  loading: { text: '检查中', status: 'processing' },
};
export const NodeStatus = ({ value }: { value?: { status: string; errText?: string } }) => {
  const { status, text } = statusMap[value.status] || {};
  return (
    <Space className={styles.nodeStatusBox} size={8}>
      <Badge status={status} text={text} />
      {value.errText && (
        <Tooltip title={value.errText}>
          <FileTextOutlined />
        </Tooltip>
      )}
    </Space>
  );
};
