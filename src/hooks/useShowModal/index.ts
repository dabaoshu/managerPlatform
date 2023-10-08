import { useCallback } from 'react';
import useSetState from '../useSetState';

type Type = 'add' | 'edit' | 'view';
export type ModalStore<T> = {
  visible: boolean;
  data: T;
  type: Type;
};

type Operation<T> = {
  handleShow: (type: Type, item?: T) => void;
  handleView: (item: T) => void;
  handleCreate: () => void;
  handleEdit: (item: T) => void;
  onCancel: () => void;
};
function useShowModal<T>(): [ModalStore<T>, Operation<T>] {
  const [state, setState] = useSetState<ModalStore<T>>({
    visible: false,
    data: undefined,
    type: undefined,
  });

  const handleView = useCallback((item: T) => {
    setState({
      visible: true,
      data: item,
      type: 'view',
    });
  }, []);

  const handleCreate = useCallback(() => {
    setState({
      visible: true,
      data: undefined,
      type: 'add',
    });
  }, []);

  const handleEdit = useCallback((item: T) => {
    setState({
      visible: true,
      data: item,
      type: 'edit',
    });
  }, []);

  const handleShow = useCallback((type: Type, item?: T) => {
    setState({
      visible: true,
      data: item,
      type,
    });
  }, []);

  const onCancel = useCallback(() => {
    setState({
      visible: false,
      data: undefined,
      type: undefined,
    });
  }, []);

  return [
    state,
    {
      handleShow,
      handleCreate,
      handleEdit,
      onCancel,
      handleView,
    },
  ];
}

export default useShowModal;
