import { Button } from 'antd';
import type { FC } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { useIntl } from 'umi';
interface Iprops {
  steps: any[];
  currStep: number;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  multistep?: boolean; // 是否多步骤
  nextStep: () => any;
  prevStep: () => any;
  handleOk: () => any;
  onCancel?: () => any;
}
// const StepContext = React.createContext({});
// StepContext.displayName = 'StepContext';
// export class StepContainer extends React.Component {
//   render(): React.ReactNode {
//     const { children } = this.props;

//     return <StepContext.Provider value={{ currStep }}>{children}</StepContext.Provider>;
//   }
// }

const StepFooter: FC<Iprops> = (props) => {
  const {
    currStep,
    multistep: _multistep = true,
    prevStep,
    nextStep,
    steps = [],
    handleOk,
    loading,
    onCancel,
    disabled,
    className,
  } = props;
  const multistep = _multistep && steps.length > 1;
  const { formatMessage } = useIntl();
  return (
    <div className={classnames(styles.Footer, className)}>
      <div className={styles.RightBtnGroup}>
        {onCancel && (
          <Button onClick={onCancel}>
            {formatMessage({ id: 'COMMON_CANCEL', defaultMessage: '取消' })}
          </Button>
        )}
        {multistep && currStep !== 0 && (
          <Button type="primary" onClick={prevStep}>
            {formatMessage({ id: 'PRE_STEP', defaultMessage: '上一步' })}
          </Button>
        )}
        {multistep && currStep !== steps.length - 1 ? (
          <Button type="primary" onClick={nextStep}>
            {formatMessage({ id: 'NEXT_STEP', defaultMessage: '下一步' })}
          </Button>
        ) : (
          <>
            {!disabled && (
              <Button type="primary" onClick={handleOk} loading={loading}>
                {formatMessage({ id: 'COMMON_OK', defaultMessage: '确定' })}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StepFooter;
