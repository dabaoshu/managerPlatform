import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { CategoryTree } from '@/components/CategoryTree';
import { DataNode } from 'antd/es/tree';
import styles from './index.less';
const dig = (path = '0', level = 3) => {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: DataNode = {
      title: key,
      key,
    };

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    }

    list.push(treeNode);
  }
  return list;
};

const treeData = dig();
const DataBaseTree = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);

  return (
    <CategoryTree
      search={true}
      treeData={treeData}
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
