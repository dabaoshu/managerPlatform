import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { useMemo } from 'react';
import { Button, Space } from 'antd';
import { LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useHistory, useParams } from 'react-router';
import { EditableProTable } from '@ant-design/pro-components';
import { BatchIpCreateModal } from '@/pages/new/batchIpCreateModal';
import { useRequest, useSetState } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { useModel } from 'umi';
import { NodeStatus } from '@/pages/new/utils';
import LoadingIcon from '@/components/loadingIcon';

interface RowData {
  status: string;
  ip: string;
  errText?: string;
  readOnly?: boolean;
  uuId?: string;
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

export default function Scaling() {
  const history = useHistory();
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const [{}, { offlineClusterNode }] = useModel('clusterRestart');
  const { nodeType, type } = useParams<{ nodeType: string; type: 'down' | 'up' }>();
  /**扩容*/
  const isUp = type === 'up';
  const [{ dataSource, offlineLoading }, setState] = useSetState<{
    dataSource: RowData[];
    offlineLoading: Record<string, boolean>;
  }>({
    dataSource: [],
    offlineLoading: {},
  });

  const { loading: tableLoading } = useRequest(ClusterApi.getinstances, {
    defaultParams: [clusterName, nodeType],
    onSuccess: (res) => {
      if (res.isSuccess) {
        setState({
          dataSource: res.data?.map((o) => ({ ...o, readOnly: true })),
        });
      }
    },
  });

  const { runAsync: checkhostFecth, loading: checkLoading } = useRequest(ClusterApi.checkhost, {
    manual: true,
  });

  const batchCreateRecord = (newList = [getDefaultRow()]) => {
    setState({
      dataSource: [...dataSource, ...newList],
    });
  };

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

  const { title, editableKeys } = useMemo(() => {
    return {
      title: `${nodeType}节点${isUp ? '扩容' : '缩容'}`,
      editableKeys: dataSource.filter((o) => !o.readOnly).map((o) => o.uuId),
    };
  }, [isUp, nodeType, dataSource]);

  const checkHost = () => {
    const needCheckList = dataSource.filter((o) => !o.readOnly).map((o) => o.ip);
    setState({
      dataSource: dataSource.map((o) => {
        if (!o.readOnly) {
          return {
            ...o,
            status: 'loading',
          };
        }
        return o;
      }),
    });
    checkhostFecth({ host: needCheckList, clusterName });
  };

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
          loading={tableLoading}
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
                <Space size={8}>
                  节点状态
                  <LoadingIcon loading={checkLoading}>
                    <ReloadOutlined
                      onClick={() => {
                        checkHost();
                      }}
                      className="cursor-pointer"
                    />
                  </LoadingIcon>
                </Space>
              ),
              editable: false,
              dataIndex: 'status',
              render: (t, r) => {
                if (r.readOnly) {
                  return null;
                }
                return <NodeStatus value={r} />;
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
                      <Button
                        key="down"
                        type="link"
                        loading={offlineLoading[record.ip]}
                        onClick={() => {
                          setState({
                            offlineLoading: {
                              ...offlineLoading,
                              [record.ip]: true,
                            },
                          });
                          offlineClusterNode({
                            clusterName,
                            role: nodeType,
                            ip: record.ip,
                          }).finally(() => {
                            setState({
                              offlineLoading: {
                                ...offlineLoading,
                                [record.ip]: false,
                              },
                            });
                          });
                        }}
                      >
                        下线
                      </Button>,
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
