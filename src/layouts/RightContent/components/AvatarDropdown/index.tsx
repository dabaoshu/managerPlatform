import { BASE_URL_OLD } from '@/constants';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from '../../index.less';
import loginServer from '@/module/login.server';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      switch (key) {
        case 'logout':
          setInitialState((s) => ({ ...s, currentUser: undefined })); //内存中数据还原
          loginServer.logout();
          break;
        case 'old':
          window.open(`/${BASE_URL_OLD.WEB}`);
          break;
        case 'user':
          history.push(`/admin/userMgt`);
          break;
        default:
          break;
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.userName) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="old">
          <SettingOutlined />
          经典系统页面
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}
      {/* {menu && (
        <Menu.Item key="user">
          <UserOutlined />
          用户管理
        </Menu.Item>
      )} */}
      {menu && <Menu.Divider />}
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
        <Avatar size="small" className={styles.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.userName}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
