import { Spin } from 'antd';
import styles from './index.less';
import classnames from 'classnames';
export function CsPage({ children, loading = false }) {
  return (
    <Spin spinning={loading} wrapperClassName="full-height-spin">
      <div className={styles.CsPage}>{children}</div>
    </Spin>
  );
}
export function CsContent({ children, className = '' }) {
  return <div className={classnames(styles.CsContent, className)}>{children}</div>;
}
