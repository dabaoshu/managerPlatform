import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import styles from './index.less';
import { useIntl } from 'umi';
import NodeConfig from './nodeConfig';
import { StepsForm } from '@ant-design/pro-components';
import EnvConfig from './envConfig';
import ClusterOption from './clusterOption';

export default function NewCluster() {
  const { formatMessage } = useIntl();

  return (
    <CsPage>
      <CsHeader leftRender={<div className={styles.title}>新建 / 接管集群</div>} />
      <CsContent>
        <StepsForm
          onFinish={(values) => {
            return Promise.resolve(true);
          }}
        >
          <EnvConfig />
          <NodeConfig />
          <ClusterOption />
        </StepsForm>
      </CsContent>
    </CsPage>
  );
}
