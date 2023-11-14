import type { FC } from 'react';
import React, { memo, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useMergedState } from 'rc-util';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import { useHistory } from 'umi';
class RootControl {
  list = [];
  add = (item) => {
    this.list.push(item);
    this.render?.();
  };
  delete = (item) => {
    this.list = this.list.filter((o) => o !== item);
    this.render?.();
  };

  clear = () => {
    this.list = [];
    this.render?.();
  };

  render?: () => void;
}

const roorControl = new RootControl();

export const PromptContextProvider = ({}) => {
  const [, forceUpdate] = useState({});
  const history = useHistory();

  useEffect(() => {
    roorControl.render = () => {
      forceUpdate({});
    };
  }, []);

  useEffect(() => {
    history.listen(() => {
      roorControl.clear();
    });
  }, []);

  return roorControl.list.map((o) => o);
};

interface PromptConfig<T, P> {
  component: FC<P>;
  data: P;
  props: T;
}

type CommonModalProps<T> = {
  open?: boolean;
  confirmLoading?: boolean;
  onOk?: (e: any) => void;
  onCancel?: (e: any) => void;
} & T;

type PromptModalProps<T = {}> = CommonModalProps<T> & {
  WrapModal: React.FC<CommonModalProps<T>>;
  destroy: (val?: any) => void;
};

const PromptModal = memo<PromptModalProps & { children: any }>(
  ({ WrapModal, destroy, ...props }) => {
    const [open, setOpen] = useMergedState(true, { value: props.open });
    const [confirmLoading, setConfirmLoading] = useMergedState(false, {
      value: props.confirmLoading,
    });
    const childRef = useRef<{ onOk: () => any }>(null);
    const currentProps = {
      ...props,
      open,
      confirmLoading,
      onOk: async (e) => {
        destroy(await childRef?.current?.onOk?.());
        setOpen(false);
        props?.onOk?.(e);
      },
      onCancel: (e) => {
        props?.onCancel?.(e);
        setOpen(false);
        destroy();
      },
    };

    useEffect(() => {
      console.log(props.children, childRef);
    }, []);

    return (
      <WrapModal {...currentProps}>
        {React.cloneElement(props.children, {
          ref: childRef,
        })}
      </WrapModal>
    );
  },
);

export function prompt<T, P>(
  config: PromptConfig<T, P>,
  WrapModal: React.FC<PromptModalProps<T>>,
): Promise<T> {
  const { component, data, props } = config;

  const isRoorControl = !!roorControl.render;
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    let vdom = null;
    const destroy = (value?: T) => {
      try {
        if (value !== undefined) {
          resolve(value);
        } else {
          reject();
        }
        if (isRoorControl) {
          roorControl.delete(vdom);
        } else {
          const unmountResult = ReactDOM.unmountComponentAtNode(div);
          if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
          }
        }
      } catch (error) {
        console.warn('prompt抛出的数据没有接收：', value, error);
      }
    };

    function render(mergeProps) {
      vdom = <PromptModal {...mergeProps}>{React.createElement(component, data)}</PromptModal>;
      if (isRoorControl) {
        roorControl.add(vdom);
      } else {
        document.body.appendChild(div);
        ReactDOM.render(
          <PromptModal {...mergeProps}>{React.createElement(component, data)}</PromptModal>,
          div,
        );
      }
    }
    render({ ...props, destroy, WrapModal });
  });
}

export const ModalPrompt = (config: PromptConfig<ModalProps, any>) => prompt(config, Modal);
