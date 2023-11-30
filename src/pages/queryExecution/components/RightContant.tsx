import { Tabs } from 'antd';
import styles from './index.less';
import type { TabsProps } from 'antd';
import { ConsoleBench } from './consoleBench';
import { useModel } from 'umi';
import { QueryExecutionConsumer, QueryExecutionContextProvider } from './consoleBench/context';

export default function RightContant(props) {
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');

  return (
    <Tabs
      rootClassName={styles.leftTabs}
      defaultActiveKey="1"
      items={[
        {
          key: '1',
          label: '控制台',
          children: (
            <QueryExecutionConsumer>
              {({ retrieveHistory, setResult, setStatus, setQueryDuration }) => (
                <ConsoleBench
                  clusterName={clusterName}
                  retrieveHistory={retrieveHistory}
                  setResult={setResult}
                  setStatus={setStatus}
                  setQueryDuration={setQueryDuration}
                />
              )}
            </QueryExecutionConsumer>
          ),
          className: styles.tabPane,
        },
      ]}
    />
  );
}
