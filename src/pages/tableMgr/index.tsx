import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import styles from './index.less';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Modal, Space, message } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';
import { ModalPrompt } from '@/utils/prompt';
import ArchiveModal from './components/ArchiveModal';
import { TablesApi } from '@/services/tables';
import { useRequest } from 'ahooks';
import { byteConvert } from '@/utils/byteConvert';
import TablePartitions from './components/TablePartitions';
import { TaskDetail } from '../task/components/TaskDetail';
import { SqlEditor } from '@/components/sqlEditor';

export default function TableMgr() {
  const actionRef = useRef<ActionType>();
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const [list, setList] = useState([]);
  const { loading: tableLoading, refresh: fetchData } = useRequest(TablesApi.tableMetrics, {
    defaultParams: [clusterName],
    onSuccess: (res) => {
      if (res.isSuccess) {
        const _list = Object.entries(res.data || []).map(([key, values]) => {
          values.readwrite_status = values?.readwrite_status?.toString().toUpperCase();
          values.queryCost = Object.values(values?.queryCost).join(',');
          values.tableName = key;
          // const [database, tableName] = key.split('.');

          values.rows = values?.rows.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 加入数字千分位分隔符
          return values;
        });
        setList(_list);
      }
    },
  });

  const listData = useMemo(() => {
    return list;
  }, [list]);

  const resumeTable = async (table) => {
    const { isSuccess } = await TablesApi.resumeTable(clusterName, table);
    if (isSuccess) {
      this.$message.success('操作成功');
    }
  };
  // 备份表
  const archiveTable = async (item) => {
    const [database, tableName] = item.tableName.split('.');
    await ModalPrompt({
      props: {
        title: '备份',
        width: 800,
      },
      data: {
        database,
        tables: [tableName],
        clusterName,
      },
      component: ArchiveModal,
    }).then((taskId) => {
      ModalPrompt({
        component: TaskDetail,
        props: {
          width: 800,
          title: '查看任务',
          cancelText: null,
        },
        data: {
          taskId: taskId,
          refresh: true,
        },
      });
    });
  };
  // 删除
  const onDelete = async (item) => {
    Modal.confirm({
      title: '提示',
      content: '确认要进行删除操作',
      onOk: async () => {
        const [database, tableName] = item.tableName.split('.');
        const { isSuccess } = await TablesApi.deleteTable(clusterName, {
          database,
          tableName,
        });
        if (isSuccess) {
          message.success(`Table ${item.tableName} 删除成功`);
          fetchData();
        }
      },
    });
  };
  // 查看分区数
  const viewPartitions = (row) => {
    const { tableName } = row;
    ModalPrompt({
      component: TablePartitions,
      props: {
        title: '分区',
        width: 800,
        cancelText: null,
        okText: null,
      },
      data: {
        clusterName,
        tableName,
      },
    }).finally(() => {
      fetchData();
    });
  };

  // 查看sql
  const viewSql = async (row) => {
    try {
      const [database, tableName] = row.tableName.split('.');
      const { isSuccess, data } = await TablesApi.viewTableCreateSql(clusterName, {
        database,
        tableName,
      });
      if (!isSuccess) return;
      const { create_table_query } = data;
      ModalPrompt({
        component: SqlEditor,
        props: {
          title: '查看sql语句',
          width: 800,
        },
        data: {
          sql: create_table_query,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ProColumns[] = [
    {
      dataIndex: 'tableName',
      title: '表名称',
      fixed: true,
      width: 130,
    },
    {
      title: '列数',
      dataIndex: 'columns',
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
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              viewPartitions(entity);
            }}
          >
            {dom}
          </a>
        );
      },
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
      render(dom, entity) {
        const { uncompressed } = entity;
        return byteConvert(uncompressed);
      },
    },
    {
      title: '占用磁盘(压缩后)',
      dataIndex: 'compressed',
      width: 130,
      render(dom, entity) {
        const { compressed } = entity;
        return byteConvert(compressed);
      },
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
          status: 'Success',
        },
        FALSE: {
          text: 'FALSE',
          status: 'Error',
        },
      },
      render(dom, entity) {
        const { readwrite_status, tableName } = entity;
        return (
          <Space size={16}>
            {dom}
            {readwrite_status === 'FALSE' && <a onClick={() => resumeTable(tableName)}>恢复</a>}
          </Space>
        );
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
        <a key="view" onClick={() => viewSql(record)}>
          查看建表语句
        </a>,
        <a key="reserved" onClick={() => archiveTable(record)}>
          备份
        </a>,
        <a key="delete" onClick={() => onDelete(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <CsPage>
      <CsHeader leftRender="表指标" />
      <CsContent>
        <div className={styles.section}>
          <ProTable
            columns={columns}
            actionRef={actionRef}
            cardProps={{
              bodyStyle: { padding: 0 },
            }}
            loading={tableLoading}
            scroll={{
              x: 1500,
            }}
            // cardBordered
            editable={{
              type: 'multiple',
            }}
            dataSource={listData}
            columnsState={{
              persistenceKey: 'tableMgr-columnsState',
              persistenceType: 'localStorage',
            }}
            rowKey="id"
            search={{}}
            options={{
              reload: () => {
                fetchData();
              },
              setting: {
                listsHeight: 400,
              },
            }}
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
