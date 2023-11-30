import { request } from 'umi';
const url = '/api/v1/metric';

export const MetricApi = {
  querymetric(params) {
    return request<API.BaseRes>(`${url}/query`, { params, method: "get" });
  },
  queryRangeMetric(id, params) {
    return request<API.BaseRes>(`${url}/query_range/${id}`, { params, method: "get" });
  },
};
