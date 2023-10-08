import { useEffect, useState } from 'react';
import { useDispatch } from 'umi';
import type { IRouteComponentProps } from 'umi';
import { Spin } from 'antd';

const CommonVerifyLayout: React.FC<IRouteComponentProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const getData = async () => {
      dispatch({
        type: 'common/getAllClusters',
        payload: {},
      }).then(() => {
        setReady(true);
      });
    };
    getData();
    return () => {
      dispatch({
        type: 'common/clear',
        payload: {},
      });
    };
  }, [dispatch]);

  if (!ready) {
    return <Spin spinning={true}></Spin>;
  }
  return <>{children}</>;
};
export default CommonVerifyLayout;
