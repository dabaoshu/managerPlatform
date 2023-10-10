import { LOCAL_STORAGE } from '@/constants';
import { stringify } from 'querystring';
import { outLogin } from '@/services/login';
import { history } from 'umi';


export const LoginUrls = ['/user/login', '/user/findpwd', '/user/updatePwd'];
const loginPath = '/user/login'

/**全局同一從這走登錄 退出 */
class LoginServer {
  currentUser: any
  // token: string

  set token(val) {
    localStorage.setItem(LOCAL_STORAGE.TOKEN, val);
  }

  get token() {
    return localStorage.getItem(LOCAL_STORAGE.TOKEN);
  }

  /**登录 */
  login = (data: { token: string, userName: string }) => {
    localStorage.setItem(LOCAL_STORAGE.TOKEN, data.token);
    localStorage.setItem(LOCAL_STORAGE.USERNAME, data.userName);
    this.currentUser = data
  }
  /**注銷 */
  logout = async (isLogoutNet = true) => {
    if (isLogoutNet) await outLogin();
    localStorage.removeItem(LOCAL_STORAGE.TOKEN)
    localStorage.removeItem(LOCAL_STORAGE.USERNAME);
    const { query = {}, search, pathname } = history.location;
    const { redirect } = query;
    try {
      throw new Error("logout")
    } catch (error) {
      console.log(error);
    }
    if (window.location.pathname !== loginPath && !redirect) {
      history.replace({
        pathname: loginPath,
        search: stringify({
          redirect: encodeURIComponent(pathname + search)
        }),
      });
    }

  }

  /**判斷是否已經登錄保存了token */
  iskeepUserToken = () => {
    return !!this.token
  }


  /**判断是否在登录相关的页面不需要token的页面 */
  iskeepLoginPage = () => {
    return LoginUrls.includes(history.location.pathname)
  }

}
const loginServer = new LoginServer()
window.loginServer = loginServer
export default loginServer