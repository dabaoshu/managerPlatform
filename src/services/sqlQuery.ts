import { request } from 'umi';
import JSONbig from 'json-big';
const url = '/api/v1/ck';

export const SqlQueryApi = {
  query(params) {
    return request(`${url}/query/${params.clusterName}`, {
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
    return request(`${url}/table_lists/${clusterName}`, {
      method: "get"
    });
  },
  queryExplain(params) {
    return request(`${url}/query_explain/${params.clusterName}`, {
      method: "get",
      params
    });
  },
  getHistory(clusterName) {
    return request(`${url}/query_history/${clusterName}`, {
      method: "get"
    });
  },
  deleteHistory({ clusterName, checksum }) {
    return request(`${url}/query_history/${clusterName}?checksum=${checksum}`, {
      method: "delete"
    });
  },
};
