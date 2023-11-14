import React, { isValidElement, useMemo, useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { useMergedState } from 'rc-util';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';
interface DraggableModalProps extends ModalProps {
  /**默认是true */
  disabled?: boolean;
}

const DraggableModal: React.FC<DraggableModalProps> = ({
  title,
  disabled: _disabled,
  ...props
}) => {
  const [disabled, setDisabled] = useMergedState(true, {
    value: _disabled,
  });
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const titleDom = useMemo(() => {
    if (title) {
      return (
        <div
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
        >
          {title}
        </div>
      );
    }
    return title;
  }, [title, disabled, setDisabled]);

  return (
    <Modal
      title={titleDom}
      {...props}
      rootClassName="sss"
      className="sss6"
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    ></Modal>
  );
};

export default DraggableModal;
