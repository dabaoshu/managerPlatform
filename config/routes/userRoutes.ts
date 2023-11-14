import { IBestAFSRoute } from '@umijs/plugin-layout';
const userRoutes: IBestAFSRoute =
{
  path: '/user',
  layout: false,
  component: "@/layouts/CommonLayout/AntdConfigProvider",
  routes: [
    {
      path: '/user/',
      redirect: '/user/login',
    },
    {
      name: 'login',
      path: '/user/login',
      component: './user/login',
    },
    // {
    //   path: '/login/findpwd',
    //   component: './login/findpwd',
    // },
    // {
    //   name: 'updatePwd',
    //   path: '/login/updatePwd',
    //   component: './login/updatePwd',
    // },
  ],
}

export default userRoutes;
