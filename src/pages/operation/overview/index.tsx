import { ClusterApi } from '@/services/cluster';
import { useMount } from 'ahooks';
import { Steps } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
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

export default function Overview() {
  const { current, next, prev, setCurrent } = useStepCurrent();
  // const [{ user, loading }] = useModel('clusterModel');

  useMount(() => {
    // ClusterApi.getCluster();
  });
  return (
    <div>
      <Steps current={current} items={steps} size="small" />
    </div>
  );
}
