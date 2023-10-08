import { IBestAFSRoute } from '@umijs/plugin-layout';

const systemRoutes: IBestAFSRoute =
{
  name: '管理端',
  icon: 'setting',
  path: '/system',
  routes: [
    {
      name: '用户管理',
      icon: 'user',
      path: '/system/userMgt',
      component: './system/userMgt',
    },
    // {
    //   name: '菜单管理',
    //   path: `system/menuMgt`,
    //   component: '@/components/IframeWrapper',
    //   query: { goUrl: `${BASE_URL_OLD.ADM}#/menuMgt` },
    // },
    // {
    //   name: '字典管理',
    //   path: `${BASE_URL_OLD.Prefix}/menuMgt`,
    //   component: '@/components/IframeWrapper',
    //   query: { goUrl: `${BASE_URL_OLD.ADM}#/menuMgt` },
    // },
  ],
}


export default systemRoutes;
