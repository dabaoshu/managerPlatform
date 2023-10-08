import { IBestAFSRoute } from '@umijs/plugin-layout';
import userRoutes from './userRoutes'
import systemRoutes from './systemRoutes';
const routes: IBestAFSRoute[] = [
  {
    path: '/',
    // redirect: "/user/login"
    // redirect: '/home',
  },
  userRoutes,
  {
    path: '/',
    component: '@/layouts/CommonLayout',
    flatMenu: true,
    routes: [
      // systemRoutes,
      { path: '/*', component: './404', }
    ],
  },
  // 此处无用啊 被上面匹配了
  {
    path: '/*',
    component: './404',
  },
];

export default routes;
