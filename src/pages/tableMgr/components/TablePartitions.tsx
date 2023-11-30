import { Modal, Table } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks';
import { TablesApi } from '@/services/tables';
interface Partition {
  name: string;
  database: string;
  table: string;
  rows: number | string;
  compressed: number;
  uncompressed: number;
  min_time: string;
  max_time: string;
  disk_name: string;
}
export default function TablePartitions({ clusterName, tableName }) {
  const [list, setList] = useState([]);

  const { loading: tableLoading, refresh: getList } = useRequest(TablesApi.getPartitions, {
    defaultParams: [clusterName, { table: tableName }],
    onSuccess: (res) => {
      if (res.isSuccess) {
        const _list = (Object.entries(res.data) || []).map(([key, values]: [string, Partition]) => {
          values.max_time = dayjs(values.max_time).format('YYYY-MM-DD HH:mm:SS');
          values.min_time = dayjs(values.min_time).format('YYYY-MM-DD HH:mm:SS');
          values.rows = values.rows.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 加入数字千分位分隔符
          values.name = key;
          return values;
        });
        setList(_list);
      }
    },
  });

  const deleteItem = async (row) => {
    Modal.confirm({
      title: '删除提示',
      okText: '删除',
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        const { min_time, table, database } = row;
        const start = dayjs(min_time);
        await TablesApi.deletePartition(clusterName, {
          database,
          tables: [table],
          begin: start.format('YYYY-MM-DD'),
          end: start.add(1, 'day').format('YYYY-MM-DD'),
        });
        getList();
      },
    });
  };

  const columns = [
    {
      dataIndex: 'name',
      // valueType: 'indexBorder',
      title: '分区名称',
      width: 130,
    },
    {
      title: '行数',
      dataIndex: 'rows',
      width: 130,
    },
    {
      title: '占用磁盘(压缩前)',
      dataIndex: 'uncompressed',
      width: 130,
    },
    {
      title: '占用磁盘(压缩后)',
      dataIndex: 'compressed',
      width: 130,
    },
    {
      title: '最小时间',
      dataIndex: 'min_time',
      width: 130,
    },
    {
      title: '最大时间',
      dataIndex: 'max_time',
      width: 130,
    },
    {
      title: '磁盘名称',
      dataIndex: 'disk_name',
      width: 130,
    },
    {
      title: '操作',
      dataIndex: 'oper',
      width: 130,
      render: (t, r) => {
        return <a onClick={() => deleteItem(r)}>删除</a>;
      },
    },
  ];

  return (
    <div>
      <Table loading={tableLoading} columns={columns} dataSource={list} />
    </div>
  );
}
