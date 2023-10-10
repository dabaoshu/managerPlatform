import { request } from 'umi';
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace LoginParams {
  export type login = {
    req: {
      password: string
      username: string
    }
    res: {
      username: string;
      token: string;
    }
  }
}


/** 登录 */
export async function login(body: LoginParams.login['req'], options = {}) {
  return request<API.BaseRes<LoginParams.login['res']>>(`/api/login`, {
    method: 'POST',
    data: body,
    ...(options || {}),
    handleResp: true
  })
}


/** 退出登录接口  */
export async function outLogin() {
  return request<Record<string, any>>(`logouted`, {
    method: 'GET',
  });
}

