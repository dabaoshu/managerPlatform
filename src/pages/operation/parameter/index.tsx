import { useRef } from 'react';
import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { Button, Space, Table, Tabs } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import styles from './index.less';
import type { EditableFormInstance } from '@ant-design/pro-components';
import { EditableProTable, ModalForm } from '@ant-design/pro-components';
import { useMount, useRequest, useSetState } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { useModel } from 'umi';

const LeftRender = () => {
  const history = useHistory();
  return (
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
      <div className={styles.title}>参数配置</div>
    </Space>
  );
};
interface Param {
  paramName: string; //参数名
  paramValue: any; //参数运行值
  paramType: string; //参数类别
  paramDesc: string; //参数描述
  updatedParamValue?: any;
}

const nodeParamItems = [
  {
    label: '集群参数配置',
    key: 'clusterParams',
  },
  {
    label: 'TSO参数配置',
    key: 'tsoParams',
  },
  {
    label: '服务发现配置',
    key: 'serviceDiscovery',
  },
  {
    label: 'DM配置',
    key: 'daemonManager',
  },
];
export default function Parameter() {
  const editableFormRef = useRef<EditableFormInstance>();
  const [{ tabKey, editType, dataSource, originDataSource, touchedList }, setState] = useSetState({
    tabKey: 'clusterParams',
    editType: false,
    dataSource: [] as Param[],
    originDataSource: {} as Record<string, Param[]>,
    touchedList: [] as Param[],
  });

  const [{ currentCluster }] = useModel('clusterModel');

  const getClusterFecth = useRequest(ClusterApi.getClusterConfig, {
    onSuccess: (res) => {
      if (res.isSuccess) {
        console.log(res.data);
      }
    },
    defaultParams: [currentCluster.cluster],
  });

  useMount(() => {
    const originDataSource = {
      clusterParams: [
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
        {
          paramName: 'tcpPort',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'httpPort',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
        {
          paramName: 'rpcPort',
          paramValue: '8124',
          paramType: '端口',
          paramDesc: 'RPC端口',
        },
      ],
      serviceDiscovery: [
        {
          paramName: 'serviceDiscovery',
          paramValue: '9010',
          paramType: '端口',
          paramDesc: '客户端连接的服务TCP端口',
        },
        {
          paramName: 'serviceDiscovery223',
          paramValue: '8123',
          paramType: '端口',
          paramDesc: 'JDBC连接用的http端口',
        },
      ],
    };
    setState({
      originDataSource,
      dataSource: originDataSource[tabKey],
    });
  });

  const onCancel = () => {
    setState({ editType: false, touchedList: [] });

    editableFormRef.current.resetFields();
  };

  const onTabChange = (activeKey) => {
    onCancel();
    setState({ tabKey: activeKey, dataSource: originDataSource[activeKey] || [] });
  };

  const checkEdit = () => {
    const values = editableFormRef.current.getFieldsValue();

    const _list: Param[] = [];

    dataSource.forEach((o) => {
      if (values[o.paramName]?.paramValue !== o.paramValue) {
        _list.push({
          ...o,
          updatedParamValue: values[o.paramName].paramValue,
        });
      }
    });
    setState({
      touchedList: _list,
    });
  };

  return (
    <CsPage>
      <CsHeader leftRender={<LeftRender />} />
      <Tabs
        activeKey={tabKey}
        onChange={onTabChange}
        items={nodeParamItems}
        animated={false}
        className={styles.tabs}
        tabBarExtraContent={
          <div className={styles.tabExtra}>
            <Button
              type="primary"
              disabled={editType}
              onClick={() => {
                setState({
                  editType: true,
                });
              }}
            >
              修改
            </Button>
          </div>
        }
      />
      <CsContent className={styles.parameterCsContent}>
        <EditableProTable<Param>
          editable={{
            type: 'multiple',
            editableKeys: editType ? dataSource.map((o) => o.paramName) : [],
          }}
          value={dataSource}
          editableFormRef={editableFormRef}
          rowKey="paramName"
          recordCreatorProps={false}
          columns={[
            {
              title: '参数名',
              dataIndex: 'paramName',
              editable: false,
            },
            {
              title: '参数描述',
              dataIndex: 'paramDesc',
              editable: false,
            },
            {
              title: '参数类别',
              dataIndex: 'paramType',
              editable: false,
            },
            {
              valueType: 'text',
              title: '参数值',
              dataIndex: 'paramValue',
              fieldProps: {
                onBlur: () => {
                  checkEdit();
                },
              },
            },
          ]}
          pagination={false}
        />
      </CsContent>
      {editType && (
        <div className={styles.footer}>
          <div className={styles.left}>
            已修改<span>{touchedList.length}</span>个参数
          </div>
          <div className={styles.right}>
            <Space size={8}>
              <Button onClick={onCancel}>取消</Button>
              <ModalForm
                title={`参数修改 `}
                modalProps={{ bodyStyle: { paddingLeft: 32 } }}
                trigger={
                  <Button
                    disabled={touchedList.length === 0}
                    type="primary"
                    // onClick={() => {
                    //   console.log(editableFormRef.current);
                    // }}
                  >
                    确认
                  </Button>
                }
                onFinish={async (v) => {
                  console.log(11, v);
                  return false;
                }}
              >
                <div className={styles.modalHeader}>
                  共修改<span>{touchedList.length}</span>个参数 修改需要重启{tabKey}，确认重启？
                </div>
                <div>
                  <Table
                    columns={[
                      {
                        title: '参数名',
                        dataIndex: 'paramName',
                      },
                      {
                        title: '当前值',
                        dataIndex: 'paramValue',
                      },
                      {
                        title: '更新值',
                        dataIndex: 'updatedParamValue',
                      },
                    ]}
                    dataSource={touchedList}
                    pagination={false}
                  />
                </div>
              </ModalForm>
            </Space>
          </div>
        </div>
      )}
    </CsPage>
  );
}
