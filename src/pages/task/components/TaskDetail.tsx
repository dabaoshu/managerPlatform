import { TaskApi } from '@/services/task';
import { useRequest, useSetState } from 'ahooks';
import { Descriptions, DescriptionsProps, Space, Table } from 'antd';
import styles from './index.less';
import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';
import { useIntl } from 'umi';
import { isChinese } from '@/utils/locale';
export const ProcessLoading = ({ color, size, width }) => {
  const list = new Array(size + 2).fill('i');
  return (
    <div className={styles.ProcessLoading} style={{ width }}>
      <div className={styles.loading}>
        {list.map((o, i) => {
          return (
            <div
              className={classnames(styles.block, {
                [styles[`block-${i + 1}`]]: true,
              })}
              style={{ backgroundColor: color }}
            ></div>
          );
        })}
      </div>
      <div></div>
    </div>
  );
};
export const TaskDetail = forwardRef<{ onOK: () => any }, { taskId: string; refresh: boolean }>(
  ({ taskId, refresh }, ref) => {
    const [{ detail, loading, list }, setState] = useSetState({
      detail: {},
      loading: false,
      list: [],
    });
    const status = useRef();

    const { locale } = useIntl();
    const lang = isChinese(locale) ? 'ZH' : 'EN';
    const { cancel, run } = useRequest(TaskApi.getTaskDetail, {
      manual: true,
      defaultParams: [taskId],
      pollingInterval: 3000,
      pollingErrorRetryCount: 6,
      onSuccess: (res) => {
        if (res.isSuccess) {
          const entity = res.data;
          setState({
            detail: entity,
            list: entity.NodeStatus,
          });
          if (
            entity.NodeStatus.filter((x) => !['Done', 'Failed'].includes(x.Status.EN)).length == 0
          ) {
            cancel();
            setState({
              loading: false,
            });
            status.current = entity.NodeStatus.every((x) => x.Status.EN === 'Done')
              ? 'Done'
              : 'Failed';

            // 任务全部完成，状态为Done，否则为Failed
          }
        }
      },
    });

    const items: DescriptionsProps['items'] = [
      {
        key: 'TaskId',
        label: '任务编号',
        children: detail.TaskId,
      },
      {
        key: 'ClusterName',
        label: '集群名称',
        children: detail.ClusterName,
      },
      {
        key: 'oper',
        label: '当前操作',
        children: detail.Option?.[lang],
      },
    ];

    useEffect(() => {
      run(taskId);
      if (refresh) {
        setState({ loading: true });
      }
    }, []);

    useImperativeHandle(ref, () => {
      return { onOk: async () => status.current };
    });

    return (
      <div>
        {items.map((o) => {
          return (
            <label key={o.key} style={{ marginLeft: 20, lineHeight: '24px' }}>
              <span className="label">{o.label}</span>:<span className="value">{o.children}</span>
            </label>
          );
        })}
        <Table
          dataSource={list}
          size="small"
          columns={[
            {
              title: '节点',
              dataIndex: 'Host',
              width: 230,
            },
            {
              title: '状态',
              dataIndex: 'Status',
              render(value, record) {
                return (
                  <Space size={16}>
                    {loading && <ProcessLoading color={'#52c41a'} width={200} size={20} />}
                    {record?.Status?.[lang]}
                  </Space>
                );
              },
            },
          ]}
        />
      </div>
    );
  },
);
