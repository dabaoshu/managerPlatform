import classnames from 'classnames';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';
export default function ExpandIcon({ open = false, className = '' }) {
  return (
    <span
      className={classnames(
        styles['action-icon'],
        {
          [styles['open']]: open,
        },
        className,
      )}
    >
      <DownOutlined />
    </span>
  );
}
