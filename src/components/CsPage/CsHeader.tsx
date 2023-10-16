import type { ReactNode } from 'react';
import styles from './index.less';
import classnames from 'classnames';

export const CsHeader = ({
  leftRender,
  extraRender,
  className,
}: {
  leftRender?: ReactNode;
  extraRender?: ReactNode;
  className?: string;
}) => {
  return (
    <header className={styles.CsHeader}>
      <div className={classnames(styles['page-header-box'], className)}>
        {leftRender && <div className={styles['page-header-left']}>{leftRender}</div>}
        {extraRender && <div className={styles['page-header-extra']}>{extraRender}</div>}
      </div>
    </header>
  );
};
