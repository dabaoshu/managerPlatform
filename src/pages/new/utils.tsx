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
    title: 'Resourcemanager',
    key: 'resourceManagerNodes',
  },
  {
    title: 'Daemonmanager',
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
    title: 'Fdb元数据',
    key: 'fdbNodes',
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
