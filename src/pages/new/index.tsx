import { CsHeader, CsPage } from '@/components/CsPage';
import React from 'react';
import styles from './index.less';
export default function NewCluster() {
  return (
    <CsPage>
      <CsHeader leftRender={<div className={styles.title}>新建 / 接管集群</div>}></CsHeader>
    </CsPage>
  );
}
