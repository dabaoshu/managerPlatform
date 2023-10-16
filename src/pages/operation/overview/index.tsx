import { ClusterApi } from '@/services/cluster';
import { useMount } from 'ahooks';
import { useModel } from 'umi';

export default function Overview() {
  // const [{ user, loading }] = useModel('clusterModel');

  useMount(() => {
    // ClusterApi.getCluster();
  });
  return <div>overview</div>;
}
