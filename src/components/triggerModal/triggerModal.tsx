import type { ModalProps } from 'antd/es';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React, { useEffect, useMemo } from 'react';
import { Modal } from 'antd';
interface TriggerModalProps extends ModalProps {
  /** @name 用于触发抽屉打开的 dom */
  trigger?: JSX.Element;
  /** @name 打开关闭的事件 */
  onOpenChange?: (visible: boolean) => void;
  /** @name 打开的回调 */
  onOpenMount?: (open) => void;
}

export function TriggerModal(props: TriggerModalProps) {
  const {
    trigger,
    visible: propVisible,
    open: propsOpen,
    onOpenChange,
    width,
    children,
    onOpenMount,
    ...rest
  } = props;
  const [open, setOpen] = useMergedState<boolean>(!!propVisible, {
    value: propsOpen || propVisible,
    onChange: onOpenChange,
  });

  useEffect(() => {
    onOpenMount(open);
  }, [open]);

  const triggerDom = useMemo(() => {
    if (!trigger) {
      return null;
    }

    return React.cloneElement(trigger, {
      key: 'trigger',
      ...trigger.props,
      onClick: async (e: any) => {
        setOpen(!open);
        trigger.props?.onClick?.(e);
      },
    });
  }, [setOpen, trigger, open]);

  useEffect(() => {
    if (open && (propsOpen || propVisible)) {
      onOpenChange?.(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propVisible, propsOpen, open]);

  return (
    <>
      <Modal
        width={width || 800}
        {...rest}
        open={open}
        onCancel={(e) => {
          // 提交表单loading时，阻止弹框关闭
          setOpen(false);
          rest?.onCancel?.(e);
        }}
        afterClose={() => {
          setOpen(false);
          rest?.afterClose?.();
        }}
      >
        {children}
      </Modal>
      {triggerDom}
    </>
  );
}
