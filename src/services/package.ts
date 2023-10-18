import { request } from 'umi';


const url = '/api/v1';

export const PackageApi = {
  getList(packageType) {
    return request(`${url}/package?pkgType=${packageType}`, {
      method: 'GET',
    })
  },
  // upload(params, opt) {
  //   return axios.post(`${url}/package`, params, opt);
  // },
  // deletePackage(params) {
  //   return axios.delete(`${url}/package`, { params });
  // },
  // getVersion() {
  //   return axios.get(`${url}/version`);
  // },
};
