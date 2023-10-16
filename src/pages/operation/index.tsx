import { useMount } from 'ahooks';
import { Button } from 'antd';
import { getMenuData } from '@ant-design/pro-components';
import { CsHeader } from '@/components/CsPage';
import styles from './index.less';
export default function Operation(props) {
  useMount(() => {
    console.log('Operation', props);
    const menuInfoData = getMenuData(props.routes);
    console.log(menuInfoData);
    const menuInfoData2 = getMenuData([props.route]);
    console.log('menuInfoData', menuInfoData);
    console.log('menuInfoData2', menuInfoData2);
  });
  return (
    <div className={styles.operation}>
      <CsHeader className={styles.operation} />
      <main>{props.children}</main>
    </div>
  );
}
