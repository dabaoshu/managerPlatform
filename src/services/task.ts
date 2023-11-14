import { request } from 'umi';
const url = '/api/v1/task';

export const TaskApi = {
  // 任务列表
  getLists() {
    return request(`${url}/lists`, {
      method: 'get'
    });
  },
  // 正在执行的任务列表
  getRunningLists() {
    return request(`${url}/running`, {
      method: "get"
    });
  },
  // 任务状态
  getTaskStatus(taskId) {
    return request(`${url}/${taskId}`, {
      method: 'get'
    });
  },
  // 删除任务
  deleteTask(taskId) {
    return request(`${url}/${taskId}`, {
      method: 'delete'
    });
  },
  // 任务详情
  getTaskDetail(taskId) {
    return request<API.BaseRes>(`${url}/${taskId}`, {
      method: 'get'
    });
  },
  // 停止任务
  stopTask(taskId) {
    return request(`${url}/${taskId}`, {
      method: 'put'
    });
  },
};
