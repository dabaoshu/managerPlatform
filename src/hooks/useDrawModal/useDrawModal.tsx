import { useMemo, useState } from 'react';
import { Modal, Drawer } from 'antd';
const useDrawModal = () => {
  // const Modal = useMemo(() => {
  //   return modalType === 'modal' ? Modal : Drawer;
  // }, [modalType]);
  const [open, setOpen] = useState(false);

  const $Modal = ({ Component, props, data }) => {
    return (
      <Modal {...props}>
        <Component {...data}></Component>
      </Modal>
    );
  };

  const $ModalSHow = () => {};

  return [$Modal];
};
