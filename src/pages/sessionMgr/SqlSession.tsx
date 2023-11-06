import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Badge, Button } from 'antd';
import { useMemo, useRef } from 'react';
import styles from './index.less';
import { useIntl, useModel } from 'umi';
import classNames from 'classnames';
import { useRequest } from 'ahooks';
import { SessionApi } from '@/services/session';

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
  const { loading, run } = useRequest(SessionApi.kill, {
    manual: true,
    onSuccess(res, params) {
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
      type="text"
      onClick={() => run(currentCluster.clusterName, { host, queryId })}
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
        sorter: true,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Query',
          defaultMessage: 'SQL语句',
        }),
        dataIndex: 'query',
        ellipsis: true,
        sorter: true,
        width: 130,
        copyable: true,
      },

      {
        title: formatMessage({
          id: 'session.Initial User',
          defaultMessage: '执行用户',
        }),
        dataIndex: 'user',
        ellipsis: true,
        sorter: true,
        width: 130,
      },

      {
        title: formatMessage({
          id: 'session.Initial Query ID',
          defaultMessage: '初始查询ID',
        }),
        dataIndex: 'queryId',
        ellipsis: true,
        sorter: true,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Node Host',
          defaultMessage: '主节点',
        }),
        dataIndex: 'host',
        ellipsis: true,
        sorter: true,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Initial Address',
          defaultMessage: '执行主机',
        }),
        dataIndex: 'address',
        ellipsis: true,
        sorter: true,
        width: 130,
      },
      {
        title: formatMessage({
          id: 'session.Thread Numbers',
          defaultMessage: '线程号',
        }),
        dataIndex: 'threads',
        ellipsis: true,
        sorter: true,
        width: 130,
      },
    ];
    if (type === 'open') {
      _columns.push({
        width: 150,
        title: '操作',
        dataIndex: 'oper',
        render: (text, record) => {
          return [<KillBtn record={record} reload={reload} />];
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
          reload: () => {
            reload();
          },
        }}
      />
    </div>
  );
}
