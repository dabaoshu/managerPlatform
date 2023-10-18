import PageLoading from '../../components/PageLoading';
import { useModel } from 'umi';
import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';
// import { useAsyncEffect } from 'ahooks';
export default function AppCluster({ children }) {
  const [ready, setReady] = useState(false);
  // const getCluster = ClusterApi.getCluster;
  const [{ loadingEffects }, { setState, getCluster }] = useModel('clusterModel');
  useAsyncEffect(async function () {
    const { data, isSuccess } = await getCluster();
    if (isSuccess) {
      const list = [];
      Object.entries(data).forEach(([name, item]) => {
        item.count = item.hosts.length;
        item.hosts = item.hosts.join(',');
        item.zkNodes = item.zkNodes.join(',');
        list.unshift(item);
      });
      if (list.length > 0) {
        setState({ currentCluster: list[0] });
      }
      setState({ clusterList: list });
      setReady(true);
    }
  }, []);

  if (!ready || loadingEffects['getCluster']) {
    return <PageLoading tip="加载中" />;
  }
  return children;
}
