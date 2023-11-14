import { request } from 'umi';

const url = '/api/v1';

export const AlarmApi = {
  getAlarm: () => request<API.BaseRes>(`${url}/monitor/warn`, {
    method: 'GET',
  }),
  createAlarm: () => request<API.BaseRes>(`${url}/monitor/warnpolicy`, {
    method: 'POST',
  }),

};
