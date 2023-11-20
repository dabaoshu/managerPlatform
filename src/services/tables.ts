import { request } from 'umi';

const url = '/api/v1';

export const TablesApi = {
  zkStatus(name: string) {
    return request(`${url}/zk/status/${name}`, {
      method: "get"
    });
  },
  tableMetrics(name: string) {
    return request<API.BaseRes>(`${url}/ck/table_metric/${name}`, {
      method: "get"
    });
  },
  deleteTable(name: string, params: { tableName: string; database: string }) {
    return request<API.BaseRes>(`${url}/ck/table/${name}`, {
      params,
      method: "delete"
    });
  },
  viewTableCreateSql(name: string, params: { tableName: string; database: string }) {
    return request<API.BaseRes>(`${url}/ck/table_schema/${name}`, {
      params,
      method: "get"
    });
  },
  replicationStatus(name: string) {
    return request<API.BaseRes>(`${url}/zk/replicated_table/${name}`, {
      method: 'get'
    });
  },
  getPartitions(clusterName, params: { table: string }) {
    return request<API.BaseRes>(`${url}/ck/partition/${clusterName}`, {
      method: 'get',
      params
    });
  },
  deletePartition(clusterName, { database, tables, begin, end }) {
    return request<API.BaseRes>(`${url}/ck/purge_tables/${clusterName}`, {
      method: 'post',
      data: {
        database,
        tables,
        begin,
        end,
      }
    });
  },
  archiveTables(clusterName, data) {
    return request<API.BaseRes>(`${url}/ck/archive/${clusterName}`, { data, method: "post" });
  },
  resumeTable(clusterName, table) {
    return request<API.BaseRes>(`${url}/ck/table/readonly/${clusterName}?table=${table}`, {
      method: "put"
    });
  },
};
