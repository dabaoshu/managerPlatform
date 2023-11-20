import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { CategoryTree } from '@/components/CategoryTree';
import { DataNode } from 'antd/es/tree';
import styles from './index.less';
import { useRequest, useSetState } from 'ahooks';
import { SqlQueryApi } from '@/services/sqlQuery';
import { useModel } from 'umi';

const DataBaseTree = () => {
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [{ treeData }, setState] = useSetState({ treeData: [] });
  const { loading } = useRequest(SqlQueryApi.getTableLists, {
    defaultParams: [clusterName],
    onSuccess: (res) => {
      if (res.isSuccess) {
        const entity = res.data;
        // const entity = {
        //   db1: {
        //     table1: {
        //       column1: {},
        //       column2: {},
        //     },
        //     table2: {
        //       column1: {},
        //       column2: {},
        //     },
        //   },
        //   db2: {
        //     table1: {
        //       column1: {},
        //       column2: {},
        //     },
        //     table2: {
        //       column1: {},
        //       column2: {},
        //     },
        //   },
        // };
        const treeData = (Object.keys(entity) || []).map((dbName) => {
          const dbItem = entity[dbName];
          const db = {
            key: dbName,
            title: dbName,
            icon: (
              <img className={styles.imgIcon} src="icons/database.png" width={18} height={18} />
            ),
            children: (Object.keys(dbItem) || []).map((tableName) => {
              const tableItem = dbItem[tableName];
              const table = {
                key: dbName + '-' + tableName,
                title: tableName,
                icon: (
                  <img className={styles.imgIcon} src="icons/table.png" width={18} height={18} />
                ),
                children: (tableItem || []).map((columnName) => {
                  return {
                    key: dbName + '-' + tableName + '-' + columnName,
                    title: columnName,
                    icon: (
                      <img
                        className={styles.imgIcon}
                        src="icons/columns.png"
                        width={18}
                        height={18}
                      />
                    ),
                    leaf: true,
                  };
                }),
              };
              return table;
            }),
          };
          return db;
        });
        setState({
          treeData,
        });
      }
    },
  });

  return (
    <CategoryTree
      search={true}
      treeData={treeData}
      loading={loading}
      expandedKeys={expandedKeys}
      onExpandedKeysChange={(keys) => {
        setExpandedKeys(keys);
      }}
      onExpand={(keys, info) => {
        // setExpandedKeys(keys);
        console.log(info);
      }}
    />
  );
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '数据库',
    children: <DataBaseTree></DataBaseTree>,
    className: styles.tabPane,
  },
];
export default function LeftAside() {
  // const [key, onChange] = useState();
  return <Tabs rootClassName={styles.leftTabs} defaultActiveKey="1" items={items} />;
}
