import { request } from 'umi';

const url = '/api/v1/ck';

export const ClusterApi = {
  getCluster: () => request<API.BaseRes>(`${url}/cluster`, {
    method: 'GET',
  }),


  /**new */
  checkhost: (payload) => request<API.BaseRes>(`/api/v1/deploy/checkhost`, {
    method: 'POST',
    data: {
      ...payload
    }
  }),
  getClusterConfig: (clusterName: string) => {
    return request<API.BaseRes>(`/api/v1/clusterconfig/${clusterName}`, {
      method: 'GET',
    });
  },
  saveClusterConfig: (clusterName: string, data) => {
    return request<API.BaseRes>(`${url}/clusterconfig/${clusterName}`, {
      method: 'PUT',
      body: data,
    });
  },

  /* 集群总览*/
  getstatics: (clusterName: string) => request<API.BaseRes>(`${url}/getstatics/${clusterName}`, {
    method: 'GET',
  }),
  /* 节点管理*/
  getinstances: (clusterName: string) => request<API.BaseRes>(`${url}/getinstances/${clusterName}`, {
    method: 'GET',
  }),
  onlineClusterNode({ clusterName, ip, role }: { clusterName?, ip?, role?}) {
    return request<API.BaseRes>(`${url}/node/start/${clusterName}`, {
      method: "PUT",
      params: { ip, role },
    });
  },
  offlineClusterNode({ clusterName, ip, role }: { clusterName?, ip?, role?}) {
    return request<API.BaseRes>(`${url}/node/stop/${clusterName}`, {
      method: "PUT",
      params: { ip, role }
    });
  },

  getNodeLog: ({ clusterName, ip, logType, role, lines = 1000, tail = true }) => {
    return request<API.BaseRes>(`${url}/node/log/${clusterName}`, {
      method: "POST",
      data: {
        lines,
        logType,
        tail,
      },
      params: {
        ip, role
      }
    });
  },
  // 获取节点列表的
  getClusterInfo: (clusterName: string, nodeType: string) => {
    return request<API.BaseRes>(`${url}/get/${clusterName}/${nodeType}`, {
      method: "get"
    })
  },
  // 创建集群
  createCluster(params) {
    return request<API.BaseRes>(`/api/v1/deploy/ck`, {
      data: params,
      method: "POST"
    });
  },

  /**未使用 */
  getClusterByName(clusterName: string) {
    return request(`${url}/cluster/${clusterName}`, {
      method: 'GET', handleResp: true
      , data: {}
    });
  },
  getClusterCreateFormSchema() {
    return request(`/api/v1/ui/schema?type=deploy`);
  },
  getClusterUpdateFormSchema() {
    return request(`/api/v1/ui/schema?type=config`);
  },
  getReBalanceFormSchema() {
    return request(`/api/v1/ui/schema?type=rebalance`);
  },
  importCluster(params) {
    return request(`${url}/cluster`, {
      method: "post",
      data: params
    });
  },

  updateCluster(params) {
    return request.put(`${url}/cluster`, params);
  },
  deleteCluster(id) {
    return request.delete(`${url}/cluster/${id}`);
  },
  manageCluster(type, params, password?) {
    const { clusterName, packageVersion, skip, policy } = params;
    if (!packageVersion) {
      return request.put(`${url}/${type}/${clusterName}?password=${password || ''}`);
    } else {
      return request.put(`${url}/${type}/${clusterName}?password=${password || ''}`, {
        packageVersion,
        skip,
        policy,
      });
    }
  },
  rebalanceCluster({ clusterName, params, all, password }) {
    return request.put(
      `${url}/rebalance/${clusterName}?password=${password || ''}&all=${all}`,
      params,
    );
  },

  addClusterNode(id, params, force, password?) {
    return request.post(`${url}/node/${id}?password=${password || ''}&force=${force}`, params);
  },
  deleteClusterNode(id, params, password?) {
    return request.delete(`${url}/node/${id}?password=${password || ''}`, { params });
  },


};
