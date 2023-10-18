import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import React, { useRef } from 'react';
import styles from './index.less';
import { useRequest, useSetState } from 'ahooks';
import { Form } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import NodeConfig from './nodeConfig';
import type { ProFormInstance } from '@ant-design/pro-components';
import { ProFormRadio, ProFormSelect, ProFormText, StepsForm } from '@ant-design/pro-components';
import { PackageApi } from '@/services/package';
import EnvConfig from './envConfig';
import ClusterOption from './clusterOption';
const steps = [
  {
    title: '环境配置',
    key: 'envConfig',
  },
  {
    title: '节点配置',
    key: 'nodeConfig',
  },
  {
    title: '集群选项',
    key: 'clusterOption',
  },
];

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const useStepCurrent = () => {
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  return {
    current,
    next,
    prev,
    setCurrent,
  };
};

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
