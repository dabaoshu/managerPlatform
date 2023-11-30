import { request } from 'umi';
import JSONbig from 'json-big';
const url = '/api/v1/ck';

export const SqlQueryApi = {
  query(clusterName, params) {
    return request<API.BaseRes>(`${url}/query/${clusterName}`, {
      data: params,
      method: "GET",
      // transformResponse: [data => {
      //   try {
      //     return JSONbig.parse(data);
      //   } catch (err) {
      //     return JSON.parse(data);
      //   }
      // }],
    })
  },
  getTableLists(clusterName) {
    return request<API.BaseRes>(`${url}/table_lists/${clusterName}`, {
      method: "get"
    });
  },
  queryExplain(clusterName, params) {
    return request<API.BaseRes>(`${url}/query_explain/${clusterName}`, {
      method: "get",
      params
    });
  },
  getHistory(clusterName) {
    return request<API.BaseRes>(`${url}/query_history/${clusterName}`, {
      method: "get"
    });
  },
  deleteHistory({ clusterName, checksum }) {
    return request<API.BaseRes>(`${url}/query_history/${clusterName}?checksum=${checksum}`, {
      method: "delete"
    });
  },
};
