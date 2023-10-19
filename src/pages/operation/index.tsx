import { useMount } from 'ahooks';
import { Button, Divider, Dropdown, Popover, Space } from 'antd';
import { getMenuData } from '@ant-design/pro-components';
import { CsContent, CsHeader } from '@/components/CsPage';
import styles from './index.less';
import { useModel } from 'umi';
import { useState } from 'react';
import { ClusterBadge } from '@/components/MenuRender/MenuHeader';
import classnames from 'classnames';
import { EllipsisOutlined } from '@ant-design/icons';
import ExpandIcon from '@/components/expandIcon';
const selfUrl = '/operation';

export default function Operation(props) {
  const { location, history } = props;
  const [menuList, setMenuList] = useState([]);
  useMount(() => {
    const MenuData = getMenuData([props.route]);
    const { breadcrumbMap } = MenuData;
    const list = [];
    for (const [key, val] of breadcrumbMap) {
      if (key !== selfUrl) {
        list.push(val);
      }
    }
    setMenuList(list);
  });

  console.log(menuList, location);

  const [{ loadingEffects, currentCluster }, { setState }] = useModel('clusterModel');

  const routePush = (pathname) => {
    history.push({
      pathname,
    });
  };

  const LeftRender = () => {
    return (
      <div className={styles.title}>
        <div className={styles.flexbox}>
          {menuList.map((menu) => {
            return (
              <div
                key={menu.path}
                className={classnames(styles.menuItem, {
                  [styles.selected]: location.pathname === menu.path,
                })}
                onClick={() => routePush(menu.path)}
              >
                {menu.name}
              </div>
            );
          })}
          <div className={styles.split}></div>
          <ClusterBadge item={currentCluster} />
        </div>
      </div>
    );
  };

  const ExtraRender = () => {
    const handleMenuClick = (info) => {
      console.log('info', info);
    };
    return (
      <Space className={styles.ExtraRender}>
        <Dropdown
          arrow={false}
          trigger={['click']}
          menu={{
            items: [
              { key: '1', label: '参数配置' },
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
              { key: '1', label: 'FE 扩容' },
              { key: '2', label: 'FE 缩容' },
              { key: '3', label: 'BE 扩容' },
              { key: '4', label: 'BE 缩容' },
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

  return (
    <div className={styles.operation}>
      <CsHeader leftRender={<LeftRender />} extraRender={<ExtraRender />} />
      <CsContent>{props.children}</CsContent>
    </div>
  );
}
