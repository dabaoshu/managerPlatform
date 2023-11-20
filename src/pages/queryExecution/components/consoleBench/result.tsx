import React, { useMemo } from 'react';
import { Table, Space, Button, Typography } from 'antd';
import { useQueryExecutionContext } from './context';

export default function Result({ clusterName }) {
  const {
    state: { result, status },
  } = useQueryExecutionContext();
  const columns = useMemo(() => {
    if (result.length === 0) return [];
    return result[0].map((x) => {
      return {
        ellipsis: true,
        title: x,
        dataIndex: x,
      };
    });
  }, [result]);

  const data = useMemo(() => {
    if (result.length <= 1) return [];
    const _columns = result[0];
    const rows = result.silce(1).map((x) => {
      const item = {};
      _columns.forEach((column, index) => {
        item[column] = x[index];
      });
      return item;
    });
    return rows;
  }, [result]);

  const loading = useMemo(() => status === 'loading', [status]);

  return (
    <Table
      size="small"
      columns={columns}
      loading={loading}
      dataSource={data}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  );
}
