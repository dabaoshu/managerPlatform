import React from 'react';
import CommonTokenLayout from './CommonTokenLayout';
import SideLayout from '../sideLayout';
import AppCluster from './appCluster';
export default (props) => {
  return (
    <CommonTokenLayout {...props}>
      <AppCluster>
        <SideLayout {...props} />
      </AppCluster>
    </CommonTokenLayout>
  );
};
