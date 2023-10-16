import React from 'react';
import { Spin } from 'antd';

const PageLoading: React.FC<{
  tip?: string;
}> = ({ tip }) => {
  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" tip={tip}>
        <div className="content" />
      </Spin>
    </div>
  );
};

export default PageLoading;
