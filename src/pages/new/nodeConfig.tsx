import {
  ProFormDependency,
  ProFormRadio,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import styles from './index.less';
import { Row, Col, Form, Badge, message, Tooltip, Space, Button } from 'antd';
import { ReloadOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';
import { useRequest } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { ipPattern } from '@/utils/regex';
import { BatchIpCreateModal } from './batchIpCreateModal';
const nodeTypes = [
  {
    title: 'server',
    key: 'serverNodes',
  },
  {
    title: 'tso',
    key: 'tsoNodes',
  },
  {
    title: 'Resourcemanager',
    key: 'resourceManagerNodes',
  },
  {
    title: 'Daemonmanager',
    key: 'daemonManagerNodes',
  },
  {
    title: '读worker',
    key: 'workerNodes',
  },
  {
    title: '写worker',
    key: 'workerWriteNodes',
  },
  {
    title: 'Fdb元数据',
    key: 'fdbNodes',
  },
];
// server/tso/resourcemanager/daemon/worker/worker-write/fdb

const statusMap = {
  '0': { text: '节点状态正常', status: 'success' },
  '1': { text: '节点连接超时', status: 'error' },
  '2': { text: '密码错误', status: 'error' },
  '3': { text: '服务拒绝连接', status: 'error' },
  default: { text: '待检测', status: 'default' },
  loading: { text: '检查中', status: 'processing' },
};
const defaultValue = { ip: '', status: 'default' };

const NodeStatus = ({ value }: { value?: { status: string; errText: string } }) => {
  const { status, text } = statusMap[value.status];
  return (
    <Space className={styles.nodeStatusBox} size={8}>
      <Badge status={status} text={text} />
      {value.errText && (
        <Tooltip title={value.errText}>
          <FileTextOutlined />
        </Tooltip>
      )}
    </Space>
  );
};

const getWayType = (nodeVisitorWay) => {
  return {
    savePassword: nodeVisitorWay === 'user',
    usePubkey: nodeVisitorWay === 'ssh',
  };
};

const NodeFormList = ({ nodeType, title }) => {
  const form = Form.useFormInstance();
  const { runAsync: checkhostFecth, loading } = useRequest(ClusterApi.checkhost, {
    manual: true,
  });

  const checkhost = (hosts) => {
    const { password, user, nodeVisitorWay, sshPort } = form.getFieldsValue();
    const { savePassword, usePubkey } = getWayType(nodeVisitorWay);
    if (!(user && password && sshPort)) {
      if (savePassword) message.error('请输入访问节点用户名，节点密码和 SSH 端口');
      if (usePubkey) message.error('请输入访问节点用户名，节点私钥和 SSH 端口');
      return;
    }
    const host = hosts.map((o) => o.ip);
    const isEmpty = hosts.some((o) => !o.ip);
    if (isEmpty) return message.error(`请输入${nodeType} 节点的ip`);
    form.setFieldsValue({
      [nodeType]: hosts.map((o) => ({ ...o, errText: '666' })),
    });
    checkhostFecth({ host, password, user, savePassword, usePubkey }).then((res) => {
      console.log(res);
    });
  };

  return (
    <Form.Item label={title} className={styles.formlist}>
      <Form.List name={nodeType} initialValue={[defaultValue]}>
        {(fields, { add, remove }) => {
          return (
            <>
              <Row className={classnames(styles.formlistheader, styles.row)} gutter={[16, 8]}>
                <Col span={9}>IP</Col>
                <Col span={8} />
                <Col span={5}>
                  节点状态
                  <ReloadOutlined
                    onClick={() => {
                      const hosts = form.getFieldValue(nodeType);
                      checkhost(hosts);
                    }}
                    className="cursor-pointer"
                  />
                </Col>
                <Col span={2}>操作</Col>
              </Row>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Row key={key} className={classnames(styles.row)} gutter={[16, 8]}>
                    <Col span={9}>
                      <ProFormText
                        fieldProps={{
                          onBlur: () => {},
                        }}
                        validateTrigger="onBlur"
                        rules={[
                          {
                            pattern: ipPattern,
                            message: 'IP 地址格式不正确',
                            validateTrigger: 'onBlur',
                          },
                        ]}
                        name={[name, 'ip']}
                        {...restField}
                      />
                    </Col>
                    <Col span={8} />
                    <Col span={5}>
                      <Form.Item name={[name]}>
                        <NodeStatus />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        disabled={fields.length === 1}
                        loading={loading}
                        icon={
                          <DeleteOutlined onClick={() => remove(key)} className="cursor-pointer" />
                        }
                      />
                    </Col>
                  </Row>
                );
              })}
              <Form.Item className={styles.primaryText}>
                <Space size={24}>
                  <span className="cursor-pointer" onClick={() => add(defaultValue)}>
                    + 节点
                  </span>
                  <BatchIpCreateModal
                    title={`批量添加 ${nodeType} 节点`}
                    trigger={<span className="cursor-pointer">批量添加</span>}
                    onFinish={(ips) => {
                      console.log(ips);

                      const field = form.getFieldValue(nodeType);
                      const ipList = ips.map((ip) => ({
                        ip,
                        status: 'default',
                      }));
                      form.setFieldValue(nodeType, [...field, ...ipList]);
                    }}
                    list={form.getFieldValue(nodeType)}
                  />
                </Space>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    </Form.Item>
  );
};

export default function NodeConfig() {
  return (
    <StepsForm.StepForm
      onFinish={async (v) => {
        console.log(v);
        return true;
      }}
      name="envConfig2"
      title="节点配置"
    >
      <div className={styles.NodeConfig}>
        <ProFormRadio.Group
          name="nodeVisitorWay"
          label="节点访问授权"
          radioType="button"
          fieldProps={{
            className: styles.RadioButton,
          }}
          initialValue={'user'}
          options={[
            {
              label: '用户名密码',
              value: 'user',
            },
            {
              label: 'SSH KEY',
              value: 'ssh',
            },
          ]}
        />
        <ProFormDependency name={['nodeVisitorWay']}>
          {({ nodeVisitorWay }) => {
            const isUser = nodeVisitorWay === 'user';
            return (
              <Row gutter={[8, 8]} className={styles.Row}>
                <Col span={isUser ? 9 : 6}>
                  <ProFormText
                    name="user"
                    fieldProps={{
                      autoComplete: 'off',
                    }}
                    label={'节点用户名'}
                  />
                </Col>

                {isUser && (
                  <Col span={9}>
                    <ProFormText.Password
                      fieldProps={{
                        autoComplete: 'new-password',
                      }}
                      name="password"
                      label={'节点密码'}
                    />
                  </Col>
                )}
                {!isUser && (
                  <Col span={9}>
                    <ProFormText.Password
                      fieldProps={{
                        autoComplete: 'new-password',
                      }}
                      name="password"
                      label={'节点私钥'}
                    />
                  </Col>
                )}
                <Col span={6}>
                  <ProFormText name="sshPort" label={'节点SSH端口'} />
                </Col>
              </Row>
            );
          }}
        </ProFormDependency>
        {nodeTypes.map((nodeType) => {
          return (
            <NodeFormList
              key={nodeType.key}
              nodeType={nodeType.key}
              title={`${nodeType.title} 节点`}
            />
          );
        })}
      </div>
    </StepsForm.StepForm>
  );
}
