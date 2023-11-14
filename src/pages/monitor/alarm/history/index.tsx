import { TimeFilter } from '@/components/timeFilter';
import { AlarmApi } from '@/services/alarm';
import { SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Input, Space } from 'antd';
import React, { useRef } from 'react';

export default function AlarmHistory() {
  const {} = useRequest(AlarmApi.getAlarm, {});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '时间',
      dataIndex: 'time',
      width: 260,
    },
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
  ];

  const onSearch = () => {
    console.log('search');
  };

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
          search: (
            <Space>
              <Input placeholder="告警名称/条件/对象" prefix={<SearchOutlined />} />
              <TimeFilter defaultValue={0} onOk={onSearch} />
            </Space>
          ),
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
