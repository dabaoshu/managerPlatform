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
  {
    path: '/test',
    component: "@/layouts/CommonLayout/AntdConfigProvider",
    exact: true,
    routes: [
      {
        path: "/test",
        component: './test',
      }
    ]
  },
  // {
  //   name: '新建/接管集群',
  //   path: '/init',
  //   component: './new',
  //   hideInMenu: true,
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
        name: '首页',
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
            name: '总览',
            path: '/operation/overview',
            component: './operation/overview',
          },
          {
            name: '节点',
            path: '/operation/nodes',
            component: './operation/nodes',
          },
          {
            name: '参数设置',
            path: '/operation/parameter',
            component: './operation/parameter',
          },
          {
            path: '/operation/scaling',
            routes: [
              {
                name: '扩容/缩容',
                path: '/operation/scaling/:nodeType',
                component: './operation/scaling',
              },
              { path: '/*', component: './404', }
            ]
          },
        ],
      },
      {
        name: '监控',
        icon: 'FundProjectionScreenOutlined',
        path: '/monitor',
        component: './monitor',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/monitor',
            redirect: './dashboard',
          },

          {
            name: '监控',
            path: '/monitor/dashboard',
            component: './monitor/dashboard',
          },
          {
            name: '新增告警',
            path: '/monitor/alarm/new',
            component: './monitor/alarm/new',
          },
          {
            name: '告警',
            path: '/monitor/alarm',
            component: './monitor/alarm',
            routes: [
              {
                path: '/monitor/alarm',
                redirect: './history',
              },
              {
                name: '告警历史',
                path: '/monitor/alarm/history',
                component: './monitor/alarm/history',
              },
              {
                name: '告警历史',
                path: '/monitor/alarm/tactics',
                component: './monitor/alarm/tactics',
              },
            ]
          },

        ],
      },
      {
        name: '表管理 ',
        icon: 'FundProjectionScreenOutlined',
        path: '/tableMgr',
        component: './tableMgr',
        hideChildrenInMenu: true,
      },
      {
        name: '会话管理 ',
        icon: 'FundProjectionScreenOutlined',
        path: '/sessionMgr',
        component: './sessionMgr',
        hideChildrenInMenu: true,
      },
      {
        name: '查询管理 ',
        icon: 'FundProjectionScreenOutlined',
        path: '/queryExecution',
        component: './queryExecution',
        hideChildrenInMenu: true,
      },
      {
        name: '安装包管理 ',
        icon: 'FundProjectionScreenOutlined',
        path: '/pkgMgr',
        component: './pkgMgr',
        // hideInMenu: true, 
        hideChildrenInMenu: true,
      },
      {
        name: '设置',
        icon: 'FundProjectionScreenOutlined',
        path: '/setting',
        component: './setting',
        // hideInMenu: true, 
        hideChildrenInMenu: true,
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
