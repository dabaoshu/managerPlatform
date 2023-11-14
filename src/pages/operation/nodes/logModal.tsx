import { TriggerModal } from '@/components/triggerModal';
import { ClusterApi } from '@/services/cluster';
import { ProForm, ProFormDigit, ProFormRadio } from '@ant-design/pro-components';
import { useRequest, useSetState } from 'ahooks';
import { Button, Checkbox, Form } from 'antd';
import styles from './index.less';
import MonacoEditor from 'react-monaco-editor';
import { SyncOutlined } from '@ant-design/icons';
export default function LogModal({ trigger, ip, role, title, clusterName }) {
  const [formRef] = Form.useForm();
  const [{ logValue }, setState] = useSetState({
    logValue: ``,
  });
  const { loading, runAsync } = useRequest(ClusterApi.getNodeLog, {
    manual: true,
    onSuccess: (res) => {
      if (res.isSuccess) {
        setState({
          logValue: res.data,
        });
      }
    },
  });

  const getLogs = () => {
    const values = formRef.getFieldsValue();
    runAsync({
      clusterName,
      role,
      ip,
      ...values,
    });
  };

  const onOpenMount = (open) => {
    if (open) {
      getLogs();
    }
  };

  return (
    <TriggerModal title={title} trigger={trigger} footer={false} onOpenMount={onOpenMount}>
      <div>
        <ProForm
          layout="inline"
          initialValues={{
            logType: 'normal',
            tail: true,
            lines: 1000,
          }}
          submitter={false}
          onValuesChange={getLogs}
          form={formRef}
        >
          <ProFormRadio.Group
            name={'logType'}
            radioType="button"
            options={[
              { label: '正常日志', value: 'normal' },
              { label: '错误日志', value: 'error' },
            ]}
            fieldProps={{
              buttonStyle: 'solid',
            }}
          />
          <Form.Item name={'tail'}>
            <Checkbox>最新日志</Checkbox>
          </Form.Item>
          <ProFormDigit
            name={'lines'}
            formItemProps={{ className: styles.logNums }}
            label="日志条数"
            fieldProps={{ precision: 0 }}
          />
          <Form.Item>
            <Button
              type="text"
              loading={loading}
              icon={
                <SyncOutlined
                  onClick={() => {
                    getLogs();
                  }}
                />
              }
            />
          </Form.Item>
        </ProForm>
      </div>
      <div style={{ marginTop: 16 }}>
        <MonacoEditor
          theme="vs-dark"
          height={300}
          options={{
            readOnly: true,
            lineDecorationsWidth: 4,
            fontSize: 12,
            selectOnLineNumbers: true,
            wordWrapColumn: 70, // 一行多少字符
            wordWrap: 'wordWrapColumn', // 一行文字超出，是否换行
            minimap: {
              // 右侧小地图配置
              enabled: true, // 是否启用小地图的渲染
            },
          }}
          value={loading ? '正在加载中...' : logValue}
        />
      </div>
    </TriggerModal>
  );
}
