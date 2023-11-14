import { SqlEditor } from '@/components/sqlEditor';
import Splitter, { SplitDirection, GutterTheme } from '@devbookhq/splitter';
import { Button, Space, Tabs } from 'antd';
import styles from './index.less';
import React from 'react';
import type { editor } from 'monaco-editor';
export class ConsoleBench extends React.Component {
  state = {
    sql: '',
  };
  sqlCodeEditor: editor.IStandaloneCodeEditor;

  run = () => {
    // const selectSql = this.sqlCodeEditor.getSelection();
    // const { sql, clusterName, selectHost } = this.state;
    // if (!selectSql && !sql) {
    //   $message.warning(this.$t('queryExecution.No Sql'));
    //   return;
    // }
    // const start = new Date().getTime();
    // const {
    //   data: { entity },
    // } = await SqlQueryApi[type === 'schedule' ? 'queryExplain' : 'query']({
    //   clusterName,
    //   query: selectSql || sql,
    //   host: selectHost,
    // }).finally(() => {
    //   const end = new Date().getTime();
    //   store.commit('sqlSelect/setStatus', '');
    //   store.commit('sqlSelect/setDuration', end - start);
    // });
  };

  editorDidMount = (editor) => {
    this.sqlCodeEditor = editor;
  };

  render() {
    const { sql } = this.state;
    return (
      <Splitter direction={SplitDirection.Vertical} gutterTheme={GutterTheme.Light}>
        <div className={styles.section}>
          <Space>
            <Button>执行查询</Button>
            <Button>执行计划</Button>
            <Button>格式化</Button>
          </Space>
          <SqlEditor
            height={'100%'}
            value={sql}
            onChange={(val) => this.setState({ sql: val })}
            editorDidMount={this.editorDidMount}
          />
        </div>
        <div>
          <Tabs
            rootClassName={styles.bottomTabs}
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: '查询历史',
                children: <div>1111</div>,
                className: styles.tabPane,
              },
              {
                key: '2',
                label: '执行结果',
                children: <div>1111</div>,
                className: styles.tabPane,
              },
            ]}
          />
        </div>
      </Splitter>
    );
  }
}
