import React from 'react';
import NodeTable from './nodeTable';
import { useRequest, useSetState } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { OperationLeftRender } from '../components/OperationLeftRender';
import { OperationExtraRender } from '../components/OperationExtraRender';
import { useModel } from 'umi';
export default function Nodes() {
  const [{ currentCluster }] = useModel('clusterModel');
  const [state, setState] = useSetState({
    serverEntity: { nodes: [] },
    resourceManagerEntity: { nodes: [] },
    tsoEntity: { nodes: [] },
    daemonEntity: { nodes: [] },
    workerWriterEntity: { nodes: [] },
    workerEntity: { nodes: [] },
    fdbEntity: { nodes: [] },
  });
  const { loading } = useRequest(ClusterApi.getinstances, {
    pollingInterval: 3000,
    pollingWhenHidden: false,
    defaultParams: [currentCluster.clusterName],
    onSuccess: (res) => {
      if (res.isSuccess && res.data) {
        setState(res.data);
      }
    },
  });
  return (
    <CsPage>
      <CsHeader leftRender={<OperationLeftRender />} extraRender={<OperationExtraRender />} />
      <CsContent>
        <div>
          <NodeTable title={'server节点'} nodeType={'server'} data={state.serverEntity.nodes} />
          <NodeTable title={'tso节点'} nodeType={'tso'} data={state.tsoEntity.nodes} />
          <NodeTable
            title={'Resourcemanager节点'}
            nodeType={'resourcemanager'}
            data={state.resourceManagerEntity.nodes}
          />
          <NodeTable
            title={'Daemonmanager节点'}
            nodeType={'daemon'}
            data={state.daemonEntity.nodes}
          />
          <NodeTable title={'读worker节点'} nodeType={'worker'} data={state.workerEntity.nodes} />
          <NodeTable
            title={'写worker节点'}
            nodeType={'worker-write'}
            data={state.workerWriterEntity.nodes}
          />
          <NodeTable title={'fdb'} nodeType={'fdb'} data={state.fdbEntity.nodes} />
        </div>
      </CsContent>
    </CsPage>
  );
}
