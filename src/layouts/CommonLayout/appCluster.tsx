import PageLoading from '../../components/PageLoading';
import { useHistory, useModel } from 'umi';
import { useAsyncEffect, useUpdateEffect } from 'ahooks';
import { useState } from 'react';
import { delay } from 'lodash';
import { message } from 'antd';
import loginServer from '@/module/login.server';
// import { useAsyncEffect } from 'ahooks';
export default function AppCluster({ children }) {
  const [ready, setReady] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const history = useHistory();
  const [{ loadingEffects, currentCluster, appCluster }, { setState, getCluster, setAppCluster }] =
    useModel('clusterModel');
  useAsyncEffect(async function () {
    try {
      const { data, isSuccess } = await getCluster();
      if (isSuccess) {
        const list = [];
        const infoList = [];
        Object.entries(data).forEach(([name, item]) => {
          item.clusterConfig = item?.clickhouse;
          list.unshift(item.clusterConfig);
          infoList.unshift(item);
        });
        // 如果没有集群，先创建集群
        // if (list.length === 0) {
        //   message.warning('没有集群,请先创建集群');
        //   history.push({
        //     pathname: '/init',
        //   });
        // }
        if (list.length > 0) {
          const target = list.find((o) => o.clusterName === appCluster?.clusterName);
          console.log(target);
          setState({ currentCluster: target || list[0] });
          setAppCluster(target || list[0]);
        }
        setState({ clusterList: list, clusterInfoList: infoList });
        setReady(true);
      }
    } catch (error) {
      setState({ clusterList: [], clusterInfoList: [] });
      setReady(true);
      loginServer.logout(true);
    }
  }, []);

  useUpdateEffect(() => {
    setSwitchLoading(true);
    delay(() => {
      setSwitchLoading(false);
    }, 600);
  }, [currentCluster?.clusterName]);

  console.log(switchLoading);
  if (switchLoading) {
    return <PageLoading tip="切换集群" />;
  }
  if (!ready || loadingEffects['getCluster']) {
    return <PageLoading tip="加载中" />;
  }

  return children;
}
