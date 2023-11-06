import styles from './index.less';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
export default function CollapsedButton({ onCollapse, collapsed }) {
  const toggleCollapsed = () => onCollapse(collapsed);
  return (
    <div className={styles['sidebar-action']}>
      <div onClick={toggleCollapsed} className={styles.btn}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
    </div>
  );
}
