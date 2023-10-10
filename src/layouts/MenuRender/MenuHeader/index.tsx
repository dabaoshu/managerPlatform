import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useState } from 'react';
import styles from './index.less';
// import ThreeHexagonsIcon from ''
export default function MenuHeader(props) {
  const { title, logo } = props;
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      content={<a onClick={hide}>Close</a>}
      title="Title"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className={styles.MenuHeader}>
        <div className={styles['logo']}>{logo}</div>
        <div className={styles['cluster-name']}>
          <div className={styles['text']}>wd</div>
          <span className={styles['action-icon']}>{open ? <UpOutlined /> : <DownOutlined />}</span>
        </div>
      </div>
    </Popover>
  );
}
