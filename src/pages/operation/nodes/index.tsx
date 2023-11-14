import React, { useMemo } from 'react';
import NodeTable from './nodeTable';
import { useRequest, useSetState } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { OperationLeftRender } from '../components/OperationLeftRender';
import { OperationExtraRender } from '../components/OperationExtraRender';
import { useModel } from 'umi';

const nodeTableList = [
  {
    title: 'server节点',
    nodeType: 'server',
    key: 'ServerEntity',
  },
  {
    title: 'tso节点',
    nodeType: 'tso',
    key: 'TsoEntity',
  },
  {
    title: 'Resourcemanager节点',
    nodeType: 'resourcemanager',
    key: 'ResourceManagerEntity',
  },
  {
    title: 'Daemonmanager节点',
    nodeType: 'daemon',
    key: 'DaemonEntity',
  },
  {
    title: '读worker节点',
    nodeType: 'worker',
    key: 'WorkerEntity',
  },
  {
    title: '写worker节点',
    nodeType: 'worker-write',
    key: 'WorkerWriterEntity',
  },
  {
    title: 'fdb节点',
    nodeType: 'fdb',
    key: 'FdbEntity',
  },
];

export default function Nodes() {
  const [{ currentCluster }] = useModel('clusterModel');
  // const [state, setState] = useSetState({
  //   ServerEntity: [],
  //   ResourceManagerEntity: [],
  //   TsoEntity: [],
  //   DaemonEntity: [],
  //   WorkerWriterEntity: [],
  //   WorkerEntity: [],
  //   FdbEntity: [],
  // });
  const { loading, data: res } = useRequest(ClusterApi.getinstances, {
    pollingInterval: 5000,
    pollingWhenHidden: false,
    defaultParams: [currentCluster.clusterName],
  });
  const state = useMemo(() => {
    if (res?.isSuccess && res?.data) {
      return res.data;
    }
    return {};
  }, [res]);

  return (
    <CsPage>
      <CsHeader leftRender={<OperationLeftRender />} extraRender={<OperationExtraRender />} />
      <CsContent>
        {nodeTableList.map((o) => {
          return (
            <NodeTable key={o.nodeType} title={o.title} nodeType={o.nodeType} data={state[o.key]} />
          );
        })}
      </CsContent>
    </CsPage>
  );
}
