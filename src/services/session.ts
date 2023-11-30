import { request } from 'umi';

const url = '/api/v1/ck';

export const SessionApi = {
  open(name: string) {
    return request<API.BaseRes>(`${url}/open_sessions/${name}`, {
      method: "GET"
    });
  },
  close(name: string, params: { limit: number; start: number; end: number }) {
    return request<API.BaseRes>(`${url}/slow_sessions/${name}`, {
      method: "GET",
      params,
    });
  },
  kill(clusterName, params: { host: string; query_id: string }) {
    return request<API.BaseRes>(`${url}/open_sessions/${clusterName}`, {
      method: "PUT",
      data: params,
    });
  },
};
