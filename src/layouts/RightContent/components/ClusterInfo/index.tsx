import { Select } from 'antd';
import React from 'react';
import styles from './index.less';
import type { CommonModelState, Loading } from 'umi';
import { useDispatch, useSelector } from 'umi';
import { LOCAL_STORAGE } from '@/constants';

const Index: React.FC = () => {
  const loadingEffect = useSelector(({ loading }: { loading: Loading }) => loading);
  const loading = loadingEffect.effects['common/getAllClusters'];
  const { clusterList, currentCluster } = useSelector(
    ({ common }: { common: CommonModelState }) => common,
  );
  const dispatch = useDispatch();
  const handleChange = (value: string) => {
    const selectCluster = clusterList.find((item) => item.clusterId === value);
    if (selectCluster) {
      localStorage.setItem(LOCAL_STORAGE.CLUSTER_INFO, JSON.stringify(selectCluster));
      dispatch({
        type: 'common/save',
        payload: {
          currentCluster: selectCluster,
        },
      });
      window.location.reload();
    }
  };
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>当前集群：</span>
      {currentCluster?.clusterName && (
        <Select
          size="small"
          loading={loading}
          style={{ maxWidth: 200, minWidth: 80 }}
          defaultValue={currentCluster?.clusterName}
          onChange={handleChange}
        >
          {clusterList?.map((item) => (
            <Select.Option key={item.clusterId} value={item.clusterId}>
              {item.clusterName}
            </Select.Option>
          ))}
        </Select>
      )}
    </div>
  );
};
export default Index;
