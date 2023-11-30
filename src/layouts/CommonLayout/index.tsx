import CommonTokenLayout from './CommonTokenLayout';
import SideLayout from '../sideLayout';
import AppCluster from './appCluster';
import AntdConfigProvider from './AntdConfigProvider';
export default (props) => {
  return (
    <AntdConfigProvider>
      <CommonTokenLayout {...props}>
        <AppCluster>
          <SideLayout {...props} />
        </AppCluster>
      </CommonTokenLayout>
    </AntdConfigProvider>
  );
};
