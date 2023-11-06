import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import React, { useMemo, useState } from 'react';
import { Button, Space, Table, Tabs } from 'antd';
import { LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useHistory, useParams } from 'react-router';
import { EditableProTable, ProTable } from '@ant-design/pro-components';
import { BatchIpCreateModal } from '@/pages/new/batchIpCreateModal';
import { useMount, useRequest, useSetState } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { useModel } from 'umi';

interface RowData {
  status: string;
  ip: string;
  errText?: string;
}

const getuuId = () => {
  return (Math.random() * 1000000).toFixed(0);
};

const getDefaultRow = () => {
  return {
    status: 'default',
    uuId: getuuId(),
    ip: '',
  };
};

export default function Scaling(props) {
  const history = useHistory();
  const [{ currentCluster }] = useModel('clusterModel');
  const { nodeType, type } = useParams<{ nodeType: string; type: 'down' | 'up' }>();
  const isUp = type === 'up'; // 扩容
  const [{ dataSource }, setState] = useSetState({
    originDataSource: [],
    dataSource: [],
  });
  console.log(nodeType);

  const { loading } = useRequest(ClusterApi.getClusterInfo, {
    defaultParams: [currentCluster.clusterName, nodeType],
    onSuccess: (res) => {
      if (res.isSuccess) {
        setState({
          dataSource: res.data?.node?.map((o) => ({ ...o, readOnly: true })),
        });
      }
    },
  });

  const batchCreateRecord = (newList = [getDefaultRow()]) => {
    setState({
      dataSource: [...dataSource, ...newList],
    });
  };

  const editableKeys = useMemo(() => {
    return dataSource.filter((o) => !o.readOnly).map((o) => o.uuId);
  }, [dataSource]);
  console.log(editableKeys);

  const toolBarRender = () => {
    return isUp
      ? [
          <BatchIpCreateModal
            key={'batch'}
            title={`批量添加节点`}
            trigger={<Button>批量添加节点</Button>}
            onFinish={(ips) => {
              const ipList = ips.map((ip) => ({
                ip,
                status: 'default',
                uuId: getuuId(),
              }));

              batchCreateRecord(ipList);
            }}
            list={dataSource.map(({ ip }) => ip)}
          />,
          <Button
            key={'single'}
            onClick={() => {
              batchCreateRecord();
            }}
            type="primary"
          >
            添加节点
          </Button>,
        ]
      : [];
  };

  const { title } = useMemo(() => {
    return { title: `${nodeType}节点${isUp ? '扩容' : '缩容'}` };
  }, [isUp, nodeType]);

  return (
    <CsPage>
      <CsHeader
        leftRender={
          <Space size={8} className={styles.LeftRender}>
            <div className={styles.backIcon}>
              <LeftOutlined
                onClick={() => {
                  history.push({
                    pathname: '/operation/nodes',
                  });
                }}
              />
            </div>
            <div className={styles.title}>{title}</div>
          </Space>
        }
      />
      <CsContent>
        <EditableProTable
          cardProps={{
            bodyStyle: { padding: 0 },
          }}
          headerTitle={'节点列表'}
          rowKey="uuId" // uuId为临时id
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row);
            },
            // onChange: setEditableRowKeys,
          }}
          columns={[
            { title: 'IP', dataIndex: 'ip' },
            {
              title: (
                <>
                  节点状态
                  <ReloadOutlined
                    onClick={() => {
                      console.log(111);
                    }}
                    className="cursor-pointer"
                  />
                </>
              ),
              editable: false,
              dataIndex: 'statusInfo',
              render: () => {
                return <div>111</div>;
              },
            },
            {
              title: '操作',
              valueType: 'option',
              width: 200,
              editable: false,
              render: (text, record) => {
                return isUp
                  ? [
                      <a
                        key="delete"
                        onClick={() => {
                          setState({
                            dataSource: dataSource.filter((item) => item.uuId !== record.uuId),
                          });
                        }}
                      >
                        删除
                      </a>,
                    ]
                  : [
                      <a
                        key="down"
                        onClick={() => {
                          console.log('下线');
                        }}
                      >
                        下线
                      </a>,
                    ];
              },
            },
          ]}
          controlled
          value={dataSource}
          recordCreatorProps={false}
          toolBarRender={toolBarRender}
          toolbar={{
            className: styles.toolbar,
          }}
        />
        {isUp && (
          <footer className={styles.footer}>
            <div className={styles.left}>已添加{}个节点</div>
            <div className={styles.right}>
              <Button size="large" type="primary">
                确定
              </Button>
            </div>
          </footer>
        )}
      </CsContent>
    </CsPage>
  );
}
