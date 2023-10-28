import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import styles from './index.less';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Input, Table } from 'antd';
import { useRef } from 'react';
import LogModal from '../operation/nodes/logModal';

export default function TableMgr() {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      dataIndex: 'tableName',
      // valueType: 'indexBorder',
      title: '表名称',
      fixed: true,
      width: 130,
    },
    {
      title: '列数',
      dataIndex: 'columns',
      // ellipsis: true,
      tip: '标题过长会自动收缩',
      sorter: true,
      width: 130,
    },
    {
      disable: true,
      title: '行数',
      dataIndex: 'rows',
      sorter: true,
      width: 130,
    },
    {
      disable: true,
      title: '分区数',
      sorter: true,
      dataIndex: 'partitions',
      search: false,
      width: 130,
    },
    {
      title: 'Parts数量',
      dataIndex: 'parts',
      sorter: true,
      hideInSearch: true,
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
      title: '读写状态',
      dataIndex: 'readwrite_status',
      valueType: 'select',
      filters: true,
      width: 130,
      valueEnum: {
        TRUE: {
          text: 'TRUE',
          status: 'Error',
        },
        FALSE: {
          text: 'FALSE',
        },
      },
    },
    {
      title: '过去24小时成功的SQL数量',
      dataIndex: 'completedQueries',
      width: 230,
    },
    {
      title: '过去24小时失败的SQL数量',
      dataIndex: 'failedQueries',
      width: 230,
    },
    {
      title: '过去7天（0.5,0.99,max）SQL耗时(ms)',
      dataIndex: 'queryCost',
      width: 260,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 300,
      fixed: 'right',
      render: (text, record, _, action) => [
        <a
          key="view"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          查看建表语句
        </a>,
        <LogModal trigger={<div>111</div>} ip="" title={''} role={''} key={'68'} />,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
          备份
        </a>,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="666">
          删除
        </a>,
      ],
    },
  ];
  return (
    <CsPage>
      <CsHeader leftRender="表指标"></CsHeader>
      <CsContent>
        <div className={styles.section}>
          <ProTable
            columns={columns}
            actionRef={actionRef}
            cardProps={{
              bodyStyle: { padding: 0 },
            }}
            scroll={{
              x: 1500,
            }}
            // cardBordered
            editable={{
              type: 'multiple',
            }}
            dataSource={[{ created_at: 'TRUE' }]}
            columnsState={{
              persistenceKey: 'tableMgr-columnsState',
              persistenceType: 'localStorage',
              onChange(value) {
                console.log('value: ', value);
              },
            }}
            toolbar={{
              search: <Input />,
            }}
            rowKey="id"
            search={false}
            // options={{
            //   setting: {
            //     listsHeight: 400,
            //   },
            // }}
            form={{}}
            // pagination={{
            //   pageSize: 5,
            //   onChange: (page) => console.log(page),
            // }}
            dateFormatter="string"
          />
        </div>
      </CsContent>
    </CsPage>
  );
}
