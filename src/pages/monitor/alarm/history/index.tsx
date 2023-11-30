import { TimeFilter, TimeFilterRef } from '@/components/timeFilter';
import { AlarmApi } from '@/services/alarm';
import { convertTimeBounds } from '@/utils/time';
import { SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useMount, useRequest, useSetState } from 'ahooks';
import { Input, Space, Tag, Tooltip } from 'antd';
import React, { useRef } from 'react';
import { useModel } from 'umi';

export default function AlarmHistory() {
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const [{ list }, setState] = useSetState({ list: [] });
  const { loading: listLoading, runAsync } = useRequest(AlarmApi.getAlarm, {
    manual: true,
    onSuccess: (res) => {
      if (res.isSuccess) {
        setState({ list: res.data });
      }
    },
  });
  const timeFilterRef = useRef<TimeFilterRef>();

  const getAlarmList = () => {
    const timeFilter = timeFilterRef.current.getValues();
    const { start, end } = convertTimeBounds(timeFilter);
    runAsync(clusterName, {
      begin_time: parseInt(`${start / 1000}`),
      end_time: parseInt(`${end / 1000}`),
    });
  };

  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: '序列号',
      dataIndex: 'id',
      width: 130,
    },
    {
      title: '时间',
      dataIndex: 'date',
      width: 130,
      valueType: 'dateTime',
    },
    {
      dataIndex: 'name',
      title: '告警名称',
      width: 130,
    },
    {
      title: '触发条件',
      dataIndex: 'trigger_name',
      width: 230,
      render(dom, entity, index, action, schema) {
        console.log(entity);

        const tags = entity?.trigger_name.map((o) => {
          const title = `${o.metric}的值不符合${o.op} ${o.right_value}`;
          return (
            <Tooltip key={o.metric} title={title}>
              <Tag color="error">{o.metric}</Tag>
            </Tooltip>
          );
        });
        return tags;
      },
    },
    {
      title: '告警对象',
      dataIndex: 'warn_object',
      width: 230,
      render(dom, entity, index, action, schema) {
        return null;
        const tags = entity?.warn_object?.map((o) => {
          const title = `${o.metric}的值不符合${o.op} ${o.right_value}`;
          return (
            <Tooltip key={o.metric} title={title}>
              <Tag color="error">{o.metric}</Tag>
            </Tooltip>
          );
        });
        return tags;
      },
    },
  ];

  useMount(() => {
    getAlarmList();
  });

  return (
    <div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        loading={listLoading}
        editable={{
          type: 'multiple',
        }}
        dataSource={list}
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
              <TimeFilter
                defaultValue={0}
                key={'timefilter'}
                ref={timeFilterRef}
                onOk={() => {
                  getAlarmList();
                }}
              />
            </Space>
          ),
        }}
        rowKey="id"
        search={false}
        options={{
          reload: () => getAlarmList(),
        }}
        form={{}}
        dateFormatter={(value) => {
          console.log(value.format('YYYY-MM-DD HH:mm:ss'));

          return value.format('YYYY-MM-DD HH:mm:ss');
        }}
      />
    </div>
  );
}
