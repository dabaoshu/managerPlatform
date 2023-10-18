import type { FC } from 'react';
import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import classnames from 'classnames';
import { formatMessage, useIntl } from 'umi';
interface Iprops {
  className?: string;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  disabled?: boolean;

  handleOk: () => any;
  onCancel: () => any;
  children?: React.ReactNode;
}
const CommonFooter: FC<Iprops> = ({
  confirmLoading,
  disabled,
  handleOk,
  onCancel,
  className,
  children,
  okText = formatMessage({ id: 'COMMON_OK', defaultMessage: '确定' }),
  cancelText = formatMessage({ id: 'COMMON_CANCEL', defaultMessage: '取消' }),
}: Iprops) => {
  // const { formatMessage } = useIntl();
  return (
    <div className={classnames(styles.Footer, className)}>
      {children}
      <div className={styles.RightBtnGroup}>
        {!disabled && (
          <Button type="primary" onClick={handleOk} loading={confirmLoading}>
            {okText}
          </Button>
        )}
        <Button onClick={onCancel}>{cancelText}</Button>
      </div>
    </div>
  );
};

export default CommonFooter;
