import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Input } from 'antd';
import React, { useRef } from 'react';

export default function Tactics() {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      dataIndex: 'tableName',
      // valueType: 'indexBorder',
      title: '告警名称',
      width: 130,
    },
    {
      title: '触发条件',
      dataIndex: 'completedQueries',
      width: 230,
    },
    {
      title: '告警对象',
      dataIndex: 'failedQueries',
      width: 230,
    },
    {
      title: '近 7 天触发次数',
      dataIndex: 'queryCost',
      width: 260,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 240,
      render: (text, record, _, action) => [
        <a key="reserved" onClick={() => {}}>
          备份
        </a>,
        <a key="delete" onClick={() => {}}>
          删除
        </a>,
      ],
    },
  ];
  return (
    <div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        // cardBordered
        editable={{
          type: 'multiple',
        }}
        dataSource={[{ created_at: 'TRUE' }]}
        columnsState={{
          persistenceKey: 'alarm-Tactics',
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
  );
}
