import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useMemo, useRef } from 'react';
import styles from './index.less';
import { useIntl, useModel } from 'umi';
import { useRequest } from 'ahooks';
import { SessionApi } from '@/services/session';
import { TriggerModal } from '@/components/triggerModal';
import { SqlEditor } from '@/components/sqlEditor';

type SqlTableProps = {
  type: 'open' | 'close';
  list: any[];
  title: React.ReactNode;
  toolActions: React.ReactNode[];
  reload: () => any;
  loading: boolean;
};

const KillBtn = ({ reload, record }) => {
  const { host, queryId } = record;
  const [{ currentCluster }] = useModel('clusterModel');
  const { loading, run: kill } = useRequest(SessionApi.kill, {
    manual: true,
    onSuccess(res) {
      if (res.isSuccess) {
        reload();
      }
    },
  });
  return (
    <Button
      key={'kill'}
      loading={loading}
      size="small"
      type="link"
      onClick={() => kill(currentCluster.clusterName, { host, queryId })}
    >
      终止
    </Button>
  );
};

export default function SqlSession({
  type,
  list = [],
  title,
  reload,
  loading,
  toolActions,
}: SqlTableProps) {
  const actionRef = useRef<ActionType>();
  const { formatMessage } = useIntl();

  const columns = useMemo<ProColumns[]>(() => {
    const _columns: ProColumns[] = [
      {
        dataIndex: 'startTime',
        // valueType: 'indexBorder',
        title: formatMessage({
          id: 'session.Query Start Time',
          defaultMessage: 'SQL开始时间',
        }),
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Query Duration',
          defaultMessage: 'SQL持续时间(ms)',
        }),
        dataIndex: 'queryDuration',
        sorter: (a, b) => a.queryDuration - b.queryDuration,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Query',
          defaultMessage: 'SQL语句',
        }),
        dataIndex: 'query',
        width: 130,
        sorter: (a, b) => a.query - b.query,
        render(dom, entity) {
          const { query } = entity;
          return (
            <TriggerModal
              title="查看sql"
              trigger={
                <div className="ellipsis">
                  <a>{query}</a>
                </div>
              }
            >
              <SqlEditor value={query} options={{ readOnly: true }} />
            </TriggerModal>
          );
        },
      },

      {
        title: formatMessage({
          id: 'session.Initial User',
          defaultMessage: '执行用户',
        }),
        dataIndex: 'user',
        ellipsis: true,
        sorter: (a, b) => a.user - b.user,
        width: 130,
      },

      {
        title: formatMessage({
          id: 'session.Initial Query ID',
          defaultMessage: '初始查询ID',
        }),
        dataIndex: 'queryId',
        ellipsis: true,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Node Host',
          defaultMessage: '主节点',
        }),
        dataIndex: 'host',
        ellipsis: true,
        sorter: (a, b) => a.host - b.host,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Initial Address',
          defaultMessage: '执行主机',
        }),
        dataIndex: 'address',
        ellipsis: true,
        sorter: (a, b) => a.address - b.address,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Thread Numbers',
          defaultMessage: '线程号',
        }),
        dataIndex: 'threads',
        ellipsis: true,
        sorter: (a, b) => a.threads - b.threads,
        width: 130,
      },
    ];
    if (type === 'open') {
      _columns.push({
        width: 150,
        title: '操作',
        dataIndex: 'oper',
        render: (text, record) => {
          return [<KillBtn key={'kill'} record={record} reload={reload} />];
        },
      });
    }
    return _columns;
  }, [formatMessage, type]);
  return (
    <div className={styles.sectionTable}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        scroll={{
          x: 1000,
        }}
        loading={loading}
        dataSource={list}
        toolbar={{
          search: title,
          actions: toolActions,
        }}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        dateFormatter="string"
        options={{
          reload: () => reload(),
        }}
      />
    </div>
  );
}
