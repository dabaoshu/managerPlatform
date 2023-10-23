import ExpandIcon from '@/components/expandIcon';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { useHistory } from 'react-router';
import styles from './index.less';
export const OperationExtraRender = () => {
  const history = useHistory();
  const routePush = (pathname) => {
    history.push({
      pathname,
    });
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'parameter':
        routePush('/operation/parameter');
        break;

      default:
        break;
    }
  };
  return (
    <Space className={styles.ExtraRender}>
      <Dropdown
        arrow={false}
        trigger={['click']}
        menu={{
          items: [
            { key: 'parameter', label: '参数配置' },
            { key: '2', label: '停止 Broker' },
            { key: '3', label: '集群升级' },
          ],
          onClick: handleMenuClick,
        }}
      >
        <Button className={styles.EllipsisBtn} icon={<EllipsisOutlined />} />
      </Dropdown>

      <Dropdown
        trigger={['click']}
        arrow={false}
        menu={{
          items: [
            { key: '1', label: 'FE 扩容' },
            { key: '2', label: 'FE 缩容' },
            { key: '3', label: 'BE 扩容' },
            { key: '4', label: 'BE 缩容' },
          ],
          onClick: handleMenuClick,
        }}
      >
        <Button>
          集群伸缩
          <ExpandIcon className={styles.ml8}></ExpandIcon>
        </Button>
      </Dropdown>
      <Dropdown
        trigger={['click']}
        arrow={false}
        menu={{
          items: [
            { key: '1', label: '重启FE' },
            { key: '2', label: '重启集群' },
          ],
          onClick: handleMenuClick,
        }}
      >
        <Button>
          重启
          <ExpandIcon className={styles.ml8} />
        </Button>
      </Dropdown>
    </Space>
  );
};
