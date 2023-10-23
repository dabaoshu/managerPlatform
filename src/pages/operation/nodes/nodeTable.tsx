import React, { useState } from 'react';
import styles from './index.less';
import { Table, Descriptions, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { useRequest } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { useModel } from 'umi';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  description: string;
}

const ExpandAction = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.actionsMask}>
      <Space size={16}>
        <div
          className={classnames('cursor-pointer', styles.actionIcon)}
          onClick={() => setOpen(!open)}
        >
          {open ? <RightOutlined /> : <LeftOutlined />}
        </div>
        {open && children}
      </Space>
    </div>
  );
};

export default function NodeTable({ title, data, nodeType }) {
  const [{ currentCluster }] = useModel('clusterModel');
  const { loading: loading1, runAsync: offlineClusterNode } = useRequest(
    ClusterApi.offlineClusterNode,
    {
      manual: true,
    },
  );
  const { loading: loading2, runAsync: onlineClusterNode } = useRequest(
    ClusterApi.onlineClusterNode,
    {
      manual: true,
    },
  );
  const tableLoading = loading1 || loading2;

  const columns: ColumnsType<DataType> = [
    { title: 'IP', dataIndex: 'ip', key: 'ip' },
    { title: '角色', dataIndex: 'hostname', key: 'hostname' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '内存利用率', dataIndex: 'memoryUsage', key: 'memoryUsage' },
    { title: 'CPU 利用率', dataIndex: 'cpuUsage', key: 'cpuUsage' },
    { title: '磁盘利用率', dataIndex: 'diskUsage', key: 'diskUsage' },
    { title: '磁盘 IO Util', dataIndex: 'diskIO', key: 'diskIO' },
    { title: '网络下载速率', dataIndex: 'networkDown', key: 'networkDown' },
    { title: '网络上传速率', dataIndex: 'networkUp', key: 'networkUp' },
    {
      className: styles.actions,
      dataIndex: 'xx',
      key: 'x',
      render: (v, r) => (
        <ExpandAction>
          <a>启动</a>
          <a>停止</a>
          <a>重启</a>
          <a>查看日志</a>
        </ExpandAction>
      ),
    },
  ];
  return (
    <section className={styles.nodeTable}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {/* <div>
          <Space size={16}>
            <a
              onClick={() =>
                onlineClusterNode({ clusterName: currentCluster.cluster, role: nodeType })
              }
            >
              重启
            </a>
            <a
              onClick={() =>
                offlineClusterNode({ clusterName: currentCluster.cluster, role: nodeType })
              }
            >
              停止
            </a>
          </Space>
        </div> */}
      </div>
      <div>
        <Table
          loading={tableLoading}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div className={styles.expandedRowRender}>
                  <Descriptions
                    column={4}
                    className={styles.baseDesc}
                    layout="vertical"
                    items={[
                      {
                        key: '1',
                        label: 'CPU',
                        style: {
                          width: '33%',
                        },

                        children: record.cpu,
                      },
                      {
                        key: '2',
                        label: '内存',
                        children: record.memory,
                      },
                      {
                        key: '3',
                        label: '硬盘',
                        children: record.disk,
                      },
                    ]}
                  />
                </div>
              );
            },
          }}
          dataSource={data}
          pagination={false}
        />
      </div>
    </section>
  );
}
