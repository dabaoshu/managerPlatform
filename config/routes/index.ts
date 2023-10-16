import userRoutes from './userRoutes'
export interface MenuDataItem {
  /** @name 子菜单 */
  children?: MenuDataItem[];
  /** @name 在菜单中隐藏子节点 */
  hideChildrenInMenu?: boolean;
  /** @name 在菜单中隐藏自己和子节点 */
  hideInMenu?: boolean;
  /** @name 在面包屑中隐藏 */
  hideInBreadcrumb?: boolean;
  /** @name 菜单的icon */
  icon?: React.ReactNode;
  /** @name 自定义菜单的国际化 key */
  locale?: string | false;
  /** @name 菜单的名字 */
  name?: string;
  /** @name 用于标定选中的值，默认是 path */
  key?: string;
  /** @name disable 菜单选项 */
  disabled?: boolean;
  /** @name 路径,可以设定为网页链接 */
  path?: string;
  /**
   * @deprecated 当此节点被选中的时候也会选中 parentKeys 的节点
   * @name 自定义父节点
   */
  parentKeys?: string[];
  /** @name 隐藏自己，并且将子节点提升到与自己平级 */
  flatMenu?: boolean;
  /** @name 指定外链打开形式，同a标签 */
  target?: string;

  [key: string]: any;
}


const routes: MenuDataItem[] = [
  userRoutes,
  // {
  //   path: '/',
  //   component: '@/layouts/CommonLayout/CommonTokenLayout',
  //   routes: [userRoutes], exact: true
  // },
  {
    path: '/',
    component: '@/layouts/CommonLayout',
    flatMenu: true,
    routes: [
      {
        path: '/',
        redirect: './home',
      },
      {
        name: '集群',
        icon: 'setting',
        path: '/home',
        component: './home',
        hideInMenu: true,
      },
      {
        name: '新建/接管集群',
        path: '/new',
        component: './new',
        hideInMenu: true,
      },
      {
        name: '集群',
        icon: 'setting',
        path: '/operation',
        component: './operation',
        hideChildrenInMenu: true,
        // redirect: './operation/overview',
        routes: [
          {
            path: '/operation',
            redirect: './overview',
          },

          {
            name: '监控',
            path: '/operation/overview',
            component: './operation/overview',
          },
          {
            name: '节点',
            path: '/operation/nodes',
            component: './operation/nodes',
          },
        ],
      },
      {
        name: '集群2',
        icon: 'setting',
        path: '/operation2',
        component: './operation',
        hideChildrenInMenu: true,
        routes: [

        ],
      },
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
