import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { useMemo, useRef } from 'react';
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
import _ from 'lodash';
import { ipPattern } from '@/utils/regex';

interface RowData {
  status: string;
  ip: string;
  errText?: string;
  readOnly?: boolean;
  uuId?: string;
}

const getuuId = () => {
  return (Math.random() * 1000000).toFixed(3);
};

const getDefaultRow = (ip = '') => {
  return {
    status: 'default',
    uuId: getuuId(),
    ip,
  };
};

export default function Scaling() {
  const [{ dataSource, offlineLoading, deleteLoading, editableKeys }, setState] = useSetState<{
    dataSource: RowData[];
    offlineLoading: Record<string, boolean>;
    deleteLoading: Record<string, boolean>;
    editableKeys: string[];
  }>({
    editableKeys: [],
    dataSource: [],
    offlineLoading: {},
    deleteLoading: {},
  });

  const setDataSource = (list) => {
    setState({
      dataSource: list,
    });
  };
  const history = useHistory();
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const { runAsync: checkhostFecth, loading: checkLoading } = useRequest(ClusterApi.checkhost, {
    manual: true,
    onSuccess: (res) => {
      if (res.isSuccess) {
        const hostStatus = res.data;
        const _hosts = dataSource.map((o) => {
          if (!_.isNil(hostStatus[o.ip])) {
            return {
              ...o,
              status: hostStatus[o.ip],
            };
          }
        });
        setDataSource(_hosts);
      }
    },
  });
  const { runAsync: add, loading: addLoading } = useRequest(ClusterApi.addClusterNode, {
    manual: true,
  });
  const [{}, { offlineClusterNode, deleteClusterNode }] = useModel('clusterRestart');
  const { nodeType } = useParams<{ nodeType: string }>();
  const tableActionRef = useRef();
  /**扩容*/

  const { loading: tableLoading } = useRequest(ClusterApi.getinstances, {
    defaultParams: [clusterName, nodeType],
    onSuccess: (res) => {
      if (res.isSuccess && !_.isNil(res.data)) {
        const list = res.data?.map((o) => ({
          ...o,
          readOnly: true,
          ...getDefaultRow(o.ip),
        }));
        setState({
          dataSource: list,
          editableKeys: dataSource.filter((o) => !o.readOnly).map((o) => o.uuId),
        });
        const needCheckList = res.data?.map((o) => o.ip);
        checkhostFecth({ host: needCheckList, clusterName });
      }
    },
  });

  const batchCreateRecord = (newList = []) => {
    setState({
      dataSource: [...dataSource, ...newList],
      editableKeys: [...dataSource, ...newList].filter((o) => !o.readOnly).map((o) => o.uuId),
    });
  };

  const toolBarRender = () => {
    return [
      <BatchIpCreateModal
        key={'batch'}
        title={`批量添加节点`}
        trigger={<Button>批量添加节点</Button>}
        onFinish={(ips) => {
          const ipList = ips.map((ip) => getDefaultRow(ip));
          batchCreateRecord(ipList);
        }}
        list={dataSource.map(({ ip }) => ip)}
      />,

      <EditableProTable.RecordCreator
        key={'single'}
        newRecordType={'dataSource'}
        record={getDefaultRow('')}
      >
        <Button
          onClick={() => {
            // tableActionRef.current?.addEditRecord(getDefaultRow(''));
          }}
          type="primary"
        >
          添加节点
        </Button>
      </EditableProTable.RecordCreator>,
    ];
  };

  const { title } = useMemo(() => {
    return {
      title: `${nodeType}节点管理`,
    };
  }, [nodeType]);

  const checkHost = () => {
    const needCheckList = dataSource.map((o) => o.ip);
    setState({
      dataSource: dataSource.map((o) => {
        return {
          ...o,
          status: 'loading',
        };
      }),
    });
    checkhostFecth({ host: needCheckList, clusterName });
  };

  const deleteHost = (uuId: string) => {
    const newDataSource = dataSource.filter((o) => o.uuId !== uuId);
    setState({
      dataSource: newDataSource,
    });
  };

  const addNodeIp = () => {
    const needCheckList = dataSource.map((o) => o.ip);
    console.log(needCheckList);

    add(clusterName, {
      ips: needCheckList,
      role: nodeType,
    });
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
            onChange: (keys) => {
              setState({
                editableKeys: keys,
              });
            },
            // onValuesChange: (record, recordList) => {
            //   setDataSource(recordList);
            // },
          }}
          columns={[
            {
              title: 'IP',
              dataIndex: 'ip',
              formItemProps: {
                validateTrigger: 'onBlur',

                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '此项是必填项',
                  },
                  {
                    pattern: ipPattern,
                    message: 'IP 地址格式不正确',
                    validateTrigger: 'onBlur',
                  },
                ],
              },
            },
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
                // if (r.readOnly) {
                //   return null;
                // }
                return <NodeStatus value={r} />;
              },
            },
            {
              title: '操作',
              valueType: 'op',
              width: 160,
              editable: false,
              render: (text, record) => {
                const List = [];
                if (record.readOnly) {
                  List.push(
                    <Button
                      type="link"
                      key="delete"
                      loading={deleteLoading[record.ip]}
                      onClick={() => {
                        setState({
                          deleteLoading: {
                            ...deleteLoading,
                            [record.ip]: true,
                          },
                        });
                        deleteClusterNode(clusterName, { role: nodeType, ip: record.ip })
                          .then(() => {
                            deleteHost(record.uuId);
                          })
                          .finally(() => {
                            setState({
                              deleteLoading: {
                                ...deleteLoading,
                                [record.ip]: false,
                              },
                            });
                          });
                      }}
                    >
                      删除
                    </Button>,
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
                  );
                } else {
                  List.push(
                    <Button
                      key="delete"
                      onClick={() => {
                        deleteHost(record.uuId);
                      }}
                    >
                      删除
                    </Button>,
                  );
                }
                return List;
              },
            },
          ]}
          recordCreatorProps={false}
          onChange={setDataSource}
          controlled
          value={dataSource}
          actionRef={tableActionRef}
          toolBarRender={toolBarRender}
          toolbar={{
            className: styles.toolbar,
          }}
        />
        <footer className={styles.footer}>
          <div className={styles.left}>已添加{editableKeys.length}个节点</div>
          <div className={styles.right}>
            <Button type="primary" loading={addLoading} onClick={() => addNodeIp()}>
              确定
            </Button>
          </div>
        </footer>
      </CsContent>
    </CsPage>
  );
}
