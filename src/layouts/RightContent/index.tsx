import { Space } from 'antd';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import styles from './index.less';
import { AvatarDropdown, NoticeIcon, ClusterInfo } from './components';
import { TranslationOutlined } from '@ant-design/icons';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  if (!initialState || !initialState.layoutSettings) {
    return null;
  }

  const { navTheme, layout } = initialState.layoutSettings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <ClusterInfo />
      {/* <NoticeIcon /> */}
      <SelectLang className={styles.action} icon={<TranslationOutlined />} />
      <AvatarDropdown menu />
    </Space>
  );
};
export default GlobalHeaderRight;
