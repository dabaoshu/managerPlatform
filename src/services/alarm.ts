import { request } from 'umi';

const url = '/api/v1';

export const AlarmApi = {
  // 历史的
  getAlarm: (clusterName: string, params) => request<API.BaseRes>(`${url}/monitor/warn/${clusterName}`, {
    method: 'GET',
    params
  }),
  createAlarm: (clusterName: string, data) => request<API.BaseRes>(`${url}/monitor/warnpolicy/${clusterName}`, {
    method: 'POST', data
  }),

};
