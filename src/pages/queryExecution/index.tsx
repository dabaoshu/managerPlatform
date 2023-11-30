import SplitPane, { Pane } from 'react-split-pane';
import LeftAside from './components/LeftAside';
import RightContant from './components/RightContant';
import './styles.less';
import { QueryExecutionContextProvider } from './components/consoleBench/context';

export default function QueryExecution() {
  return (
    <QueryExecutionContextProvider>
      <div className="full-page">
        <SplitPane split="vertical" minSize={180} defaultSize={230} primary="first">
          <LeftAside />
          <RightContant />
        </SplitPane>
      </div>
    </QueryExecutionContextProvider>
  );
}
