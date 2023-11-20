import { Table, Space, Button, Typography } from 'antd';
import { useMount } from 'ahooks';
import { useQueryExecutionContext } from './context';
import { SqlQueryApi } from '@/services/sqlQuery';
import { useLoadings } from '@/hooks';

export default function Histoty({ addSql, clusterName }) {
  const {
    state: { historyList = [] },
    retrieveHistory,
    deleteHistory,
  } = useQueryExecutionContext();
  const { loadings, openLoading, closeLoading } = useLoadings();
  useMount(() => {
    retrieveHistory(clusterName);
  });

  const deleteHistoryFetch = async (record) => {
    openLoading(record.CheckSum);
    const { isSuccess } = await SqlQueryApi.deleteHistory({
      checkSum: record.CheckSum,
      clusterName,
    }).finally(() => {
      closeLoading(record.CheckSum);
    });
    if (isSuccess) {
      deleteHistory({
        checkSum: record.CheckSum,
        clusterName,
      });
    }
  };

  return (
    <Table
      onRow={(record) => {
        return {
          onDoubleClick: () => {
            addSql(record.QuerySql);
          },
        };
      }}
      size="small"
      columns={[
        {
          title: '查询语句',
          dataIndex: 'QuerySql',
          ellipsis: true,
        },
        {
          dataIndex: 'CreateTime',
          title: '创建时间',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 160,
          render(value, record) {
            return (
              <Space>
                <Typography.Paragraph
                  style={{ marginBottom: 0 }}
                  copyable={{ text: record.QuerySql }}
                >
                  复制
                </Typography.Paragraph>

                <Button
                  loading={loadings[record.CheckSum]}
                  type="link"
                  onClick={() => deleteHistoryFetch(record)}
                >
                  删除
                </Button>
              </Space>
            );
          },
        },
      ]}
      dataSource={historyList}
    />
  );
}
