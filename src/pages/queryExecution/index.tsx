import React from 'react';
import Splitter, { SplitDirection, GutterTheme } from '@devbookhq/splitter';
import LeftAside from './components/LeftAside';
import RightContant from './components/RightContant';
export default function QueryExecution() {
  function handleResizeStarted(gutterIdx: number) {
    console.log('Resize started!', gutterIdx);
  }
  function handleResizeFinished(gutterIdx: number, newSizes: number[]) {
    console.log('Resize finished!', gutterIdx, newSizes);
  }
  return (
    <div className="full-page">
      <Splitter
        direction={SplitDirection.Horizontal}
        gutterTheme={GutterTheme.Light}
        minWidths={[20, 60]}
        onResizeStarted={handleResizeStarted}
        onResizeFinished={handleResizeFinished}
      >
        <LeftAside />
        <Splitter direction={SplitDirection.Vertical} gutterTheme={GutterTheme.Light}>
          <RightContant />
        </Splitter>
      </Splitter>
    </div>
  );
}
