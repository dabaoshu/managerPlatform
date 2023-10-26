import type { ProLayoutProps } from '@ant-design/pro-components';
import { ProLayout } from '@ant-design/pro-components';
import CollapsedButton from '@/components/MenuRender/CollapsedButton';
import MenuHeader from '@/components/MenuRender/MenuHeader';

import styles from './index.less';
import { Link, useModel } from 'umi';
import { transformRoute, getMatchMenu } from '@umijs/route-utils';
import { useMemo } from 'react';
import { WithExceptionOpChildren } from '@/components/Exception';

// const Footer: React.FC = () => {
//   const { formatMessage } = useIntl();
//   const defaultMessage = formatMessage({
//     id: 'app.proName',
//     defaultMessage: '浩鲸大数据平台',
//   });
//   const currentYear = new Date().getFullYear();
//   return <DefaultFooter copyright={`${currentYear} by ${defaultMessage}`} />;
// };

export default (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { layoutSettings } = initialState;
  const { children } = props;

  const onCollapse = (collapsed) => {
    setInitialState({
      ...initialState,
      layoutSettings: {
        ...layoutSettings,
        collapsed: !collapsed,
      },
    });
  };

  const _props: ProLayoutProps = {
    siderWidth: 208,
    collapsed: layoutSettings.collapsed,
    onCollapse,
    rightContentRender: false,
    waterMarkProps: {
      content: initialState?.currentUser?.userName,
    },
    collapsedButtonRender: (collapsed, dom) => {
      return <CollapsedButton collapsed={collapsed} onCollapse={onCollapse} />;
    },
    menuHeaderRender: (logo, title, c) => <MenuHeader logo={logo} title={title} props={c} />,
    onMenuHeaderClick: () => {},
    contentStyle: {
      padding: 0,
      height: '100%',
      overflow: 'auto',
    },
    disableMobile: true,
    menuItemRender: (menuItemProps, defaultDom) => {
      if (menuItemProps.isUrl) {
        return defaultDom;
      }
      if (menuItemProps.path && location.pathname.indexOf(menuItemProps.path) !== 0) {
        return (
          <Link to={menuItemProps.path} target={menuItemProps.target}>
            {defaultDom}
          </Link>
        );
      }
      return defaultDom;
    },
    ...layoutSettings,
  };

  const currentPathConfig = useMemo(() => {
    const { menuData } = transformRoute(props?.route?.routes || [], undefined, undefined, true);
    return getMatchMenu(location.pathname, menuData).pop() || {};
  }, [location?.pathname, props?.route?.routes]);

  console.log(currentPathConfig);

  return (
    <div className={styles.sideRoot}>
      <ProLayout {..._props} route={props.route}>
        <WithExceptionOpChildren currentPathConfig={currentPathConfig}>
          <div className={styles.right}>{children}</div>
        </WithExceptionOpChildren>
      </ProLayout>
    </div>
  );
};
