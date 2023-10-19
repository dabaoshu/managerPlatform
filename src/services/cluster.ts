import { request } from 'umi';

const url = '/api/v1/ck';
const createUrl = '/api/v1/deploy/ck';

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
  getstatics: () => request<API.BaseRes>(`${url}/getstatics`, {
    method: 'GET',
  }),

  /**未使用 */
  getClusterByName(clusterName: string) {
    return request(`${url}/cluster/${clusterName}`, {
      method: 'GET', handleResp: true
      , data: {}
    });
  },
  getClusterConfig(clusterName: string) {
    return request(`${url}/config/${clusterName}`, {
      method: 'GET',
    });
  },
  saveClusterConfig(clusterName: string, data, force) {
    return request(`${url}/config/${clusterName}?force=${force}`, {
      method: 'post',
      body: data,
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
    return request.post(`${url}/cluster`, params);
  },
  createCluster(params, force) {
    return request.post(`${createUrl}/?force=${force}`, params);
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
  getClusterInfo(id) {
    return request.get(`${url}/get/${id}`);
  },
  addClusterNode(id, params, force, password?) {
    return request.post(`${url}/node/${id}?password=${password || ''}&force=${force}`, params);
  },
  deleteClusterNode(id, params, password?) {
    return request.delete(`${url}/node/${id}?password=${password || ''}`, { params });
  },
  onlineClusterNode(clusterName, ip, password?) {
    return request.put(`${url}/node/start/${clusterName}?ip=${ip}&password=${password || ''}`);
  },
  offlineClusterNode(clusterName, ip, password?) {
    return request.put(`${url}/node/stop/${clusterName}?ip=${ip}&password=${password || ''}`);
  },
  getNodeLog({ clusterName, ip, logType, lines = 1000, tail = true }) {
    return request.post(`${url}/node/log/${clusterName}?ip=${ip}`, {
      lines,
      logType,
      tail,
    });
  },
};
