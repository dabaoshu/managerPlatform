import { SqlEditor } from '@/components/sqlEditor';
import { Button, Form, Select, Space, Tabs, message } from 'antd';
import styles from './index.less';
import React from 'react';
import type { editor } from 'monaco-editor';
import { SqlQueryApi } from '@/services/sqlQuery';
import Histoty from './histoty';
import { format } from 'sql-formatter';
import SplitPane, { Pane } from 'react-split-pane';
import Result from './result';

export class ConsoleBench extends React.Component<{ clusterName: string }> {
  sqlCodeEditor: editor.IStandaloneCodeEditor;
  constructor(props) {
    super(props);

    this.state = {
      sql: '',
      selectHost: '',
      hosts: [],
    };
  }
  con;

  componentDidMount(): void {
    this.fetchNodeList();
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this.handleKeydown);
  }
  handleKeydown = (e) => {
    switch (e.key) {
      case 'F8':
        this.run();
        break;
      case 'F9':
        this.run('schedule');
        break;
      case 'F10':
        this.format();
        break;
    }
  };

  fetchNodeList = () => {};

  run = async (type = '') => {
    const selectSql = this.sqlCodeEditor.getSelection();
    const { clusterName, retrieveHistory, setResult, setStatus, setQueryDuration } = this.props;
    const { sql, selectHost } = this.state;
    if (!selectSql && !sql) {
      message.warning('请输入sql语句');
      return;
    }
    const start = new Date().getTime();
    setStatus('running');
    const { data, isSuccess } = await SqlQueryApi[type === 'schedule' ? 'queryExplain' : 'query']({
      clusterName,
      query: selectSql || sql,
      host: selectHost,
    }).finally(() => {
      const end = new Date().getTime();
      setStatus('');
      setQueryDuration(end - start);
    });
    if (isSuccess) {
      retrieveHistory(clusterName);
      setResult(data);
    }
  };

  format = () => {
    const val = format(this.sqlCodeEditor.getValue(), {
      language: 'sql',
      tabWidth: 2,
      keywordCase: 'upper',
      linesBetweenQueries: 2,
    });
    this.sqlCodeEditor.setValue(val);
  };

  render() {
    const { sql, hosts, selectHost } = this.state;
    const { clusterName } = this.props;
    return (
      <SplitPane split="horizontal" minSize={350} defaultSize={450}>
        <Pane>
          <div className={styles.section}>
            <div className={styles.toolbar}>
              <Space>
                <Button onClick={() => this.run()}>执行查询</Button>
                <Button onClick={() => this.run('schedule')}>执行计划</Button>
                <Button onClick={this.format}>格式化</Button>
              </Space>
              <div className={styles.toolbarRight}>
                <Form.Item label={'节点'}>
                  <Select
                    style={{ width: 160 }}
                    options={hosts}
                    value={selectHost}
                    onChange={(v) => this.setState({ selectHost: v })}
                  />
                </Form.Item>
              </div>
            </div>
            <div className={styles.editorBox}>
              <SqlEditor
                height={'100%'}
                value={sql}
                onChange={(val) => this.setState({ sql: val })}
                editorDidMount={(editor) => (this.sqlCodeEditor = editor)}
                options={{}}
              />
            </div>
          </div>
        </Pane>
        <div>
          <Tabs
            rootClassName={styles.bottomTabs}
            defaultActiveKey="history"
            items={[
              {
                key: 'history',
                label: '查询历史',
                children: (
                  <Histoty
                    clusterName={clusterName}
                    addSql={(str) => {
                      this.sqlCodeEditor.setValue(`${sql}${sql ? '\n\n' : ''}${str}`);
                    }}
                  />
                ),
                className: styles.tabPane,
              },
              {
                key: 'result',
                label: '执行结果',
                children: <Result clusterName={clusterName} />,
                className: styles.tabPane,
              },
            ]}
          />
        </div>
      </SplitPane>
    );
  }
}
