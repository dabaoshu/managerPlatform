import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import styles from './index.less';
import { useHistory, useIntl } from 'umi';
import NodeConfig from './nodeConfig';
import { StepsForm } from '@ant-design/pro-components';
import EnvConfig from './envConfig';
import ClusterOption from './clusterOption';
import { nodeTypes } from './utils';
import { ClusterApi } from '@/services/cluster';
import { App } from 'antd';
import { useRef, useState } from 'react';

export default function NewCluster() {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const { message } = App.useApp();
  const createCluester = async (values) => {
    const nodeValues = { ...values };

    nodeTypes.forEach(({ key }) => {
      nodeValues[key] = values[key]?.map((o) => o.ip);
    });
    try {
      ClusterApi.createCluster(nodeValues).then((res) => {
        if (res.isSuccess) {
          message.success('创建成功');
          history.push({
            pathname: '/home',
          });
        }
      });
    } catch (error) {}

    return;
  };
  const formRef = useRef();

  const [current, onCurrentChange] = useState(0);

  return (
    <CsPage>
      <CsHeader leftRender={<div className={styles['page-title']}>新建 / 接管集群</div>} />
      <CsContent>
        <StepsForm
          formRef={formRef}
          current={current}
          onCurrentChange={onCurrentChange}
          containerStyle={{
            paddingBottom: 20,
          }}
          onFinish={createCluester}
        >
          <EnvConfig />
          <NodeConfig />
          <ClusterOption />
        </StepsForm>
      </CsContent>
    </CsPage>
  );
}
