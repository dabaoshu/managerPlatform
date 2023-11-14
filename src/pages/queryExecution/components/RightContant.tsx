import React from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
import type { TabsProps } from 'antd';
import { ConsoleBench } from './consoleBench';

export default function RightContant(props) {
  console.log(props);

  return (
    <Tabs
      rootClassName={styles.leftTabs}
      defaultActiveKey="1"
      items={[
        {
          key: '1',
          label: '控制台',
          children: <ConsoleBench></ConsoleBench>,
          className: styles.tabPane,
        },
      ]}
    />
  );
}
