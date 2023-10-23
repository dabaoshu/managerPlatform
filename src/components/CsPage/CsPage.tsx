import styles from './index.less';
import classnames from 'classnames';
export function CsPage({ children }) {
  return <div className={styles.CsPage}>{children}</div>;
}
export function CsContent({ children, className = '' }) {
  return <div className={classnames(styles.CsContent, className)}>{children}</div>;
}
