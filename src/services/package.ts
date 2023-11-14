import { uploadFile } from '@/requestConfig';
import { request } from 'umi';


const url = '/api/v1';

export const PackageApi = {
  getList(packageType) {
    return request(`${url}/package?pkgType=${packageType}`, {
      method: 'GET',
    })
  },
  upload(data, onProgress) {
    return uploadFile(`${url}/package`, {
      method: "post",
      requestType: "file",
      handleResp: false,
      data: data,
      onProgress: onProgress
    });
  },
  // upload(data) {
  //   return request(`${url}/package`, {
  //     method: "post",
  //     requestType: "file",
  //     handleResp: false,
  //     body: data,
  //     onProgress: (obj) => {
  //       console.log(obj);

  //     },
  //   });
  // },
  deletePackage(params) {
    return request(`${url}/package`, {
      method: "delete",
      params
    });
  },
  getVersion() {
    return request(`${url}/version`, {
      method: "get"
    });
  },
};
