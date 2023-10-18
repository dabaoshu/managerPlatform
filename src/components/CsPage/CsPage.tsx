import styles from './index.less';
export function CsPage({ children }) {
  return <div className={styles.CsPage}>{children}</div>;
}
export function CsContent({ children }) {
  return <div className={styles.CsContent}>{children}</div>;
}
