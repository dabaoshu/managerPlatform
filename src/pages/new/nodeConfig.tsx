import {
  ProFormCheckbox,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import styles from './index.less';
import { Row, Col, Form, message, Space, Button } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';
import { useRequest } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { ipPattern } from '@/utils/regex';
import { BatchIpCreateModal } from './batchIpCreateModal';
import LoadingIcon from '@/components/loadingIcon';
import { NodeStatus, nodeTypes } from './utils';
import { requiredRule } from '@/utils/form';
import { useRef, useState } from 'react';

const defaultValue = { ip: '', status: 'default' };

const getWayType = (nodeVisitorWay) => {
  return {
    userPassword: nodeVisitorWay === 'user',
    usePubkey: nodeVisitorWay === 'ssh',
  };
};

const NodeFormList = ({ nodeType, title }) => {
  const form = Form.useFormInstance();
  const { runAsync: checkhostFecth, loading: checkLoading } = useRequest(ClusterApi.checkhost, {
    manual: true,
  });

  const checkHost = (hosts) => {
    const { password, user, nodeVisitorWay, sshPort, savePassword } = form.getFieldsValue();
    const { userPassword, usePubkey } = getWayType(nodeVisitorWay);
    if (!(user && password && sshPort)) {
      if (userPassword) message.error('请输入访问节点用户名，节点密码和 SSH 端口');
      if (usePubkey) message.error('请输入访问节点用户名，节点私钥和 SSH 端口');
      return;
    }
    const host = hosts.map((o) => o.ip);
    const isEmpty = hosts.some((o) => !o.ip);
    if (isEmpty) return message.error(`请输入${nodeType} 节点的ip`);
    form.setFieldsValue({
      [nodeType]: hosts.map((o) => ({ ...o, status: 'loading' })),
    });
    checkhostFecth({ host, password, user, sshPort, savePassword, usePubkey }).then((res) => {
      if (res.isSuccess) {
        const hostStatus = res.data;
        const _hosts = hosts.map((o) => {
          if (!_.isNil(hostStatus[o.ip])) {
            return {
              ...o,
              status: hostStatus[o.ip],
            };
          }
        });
        form.setFieldsValue({
          [nodeType]: _hosts,
        });
      }
    });
  };

  return (
    <Form.Item
      label={<div className={styles.title}>{title}</div>}
      className={classnames(styles.formlist)}
    >
      <Form.List name={nodeType} initialValue={[defaultValue]}>
        {(fields, { add, remove }) => {
          return (
            <div className={styles.border}>
              <Row className={classnames(styles.formlistheader, styles.row)} gutter={[16, 8]}>
                <Col span={9}>IP</Col>
                <Col span={8} />
                <Col span={5}>
                  <Space size={8}>
                    <span>节点状态</span>
                    <LoadingIcon loading={checkLoading}>
                      <ReloadOutlined
                        onClick={() => {
                          const hosts = form.getFieldValue(nodeType);
                          checkHost(hosts);
                        }}
                        className="cursor-pointer"
                      />
                    </LoadingIcon>
                  </Space>
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
                        type="text"
                        disabled={fields.length === 1}
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
            </div>
          );
        }}
      </Form.List>
    </Form.Item>
  );
};

const portItemList = [
  { label: '客户端连接tcp端口', name: ['clickhouse', 'ckTcpPort'], defaultValue: 9010 },
  { label: 'Jdbc端口', name: ['clickhouse', 'httpPort'], defaultValue: 8123 },
  { label: 'Rpc端口', name: ['clickhouse', 'rpcPort'], defaultValue: 8124 },
  { label: '复杂查询的数据传输端口', name: ['clickhouse', 'exchPort'], defaultValue: 9300 },
  { label: '复杂查询的控制指令端口', name: ['clickhouse', 'exStatPort'], defaultValue: 9400 },
  { label: 'Tso端口', name: ['clickhouse', 'tsoPort'], defaultValue: 9910 },
  { label: 'Rm端口', name: ['clickhouse', 'rmPort'], defaultValue: 9925 },
  { label: 'Daemon端口', name: ['clickhouse', 'dmPort'], defaultValue: 9920 },
  { label: 'hdfs端口', name: 'hdfsPort', defaultValue: 8020 },
];

const AdvancedConfig = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={classnames(styles.horizontalForm, styles.border)}>
      <div className={styles.advance}>
        <span className={styles.left}>高级配置</span>
        <a className={styles.right} onClick={() => setOpen(!open)}>
          {open ? '收缩' : '展开'}
        </a>
      </div>
      <div style={{ display: open ? 'block' : 'none' }}>
        {portItemList.map((portItem) => {
          return (
            <ProFormDigit
              {...{
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
              }}
              key={portItem.name[1]}
              name={portItem.name}
              label={portItem.label}
              initialValue={portItem.defaultValue}
            />
          );
        })}
      </div>
    </div>
  );
};

export default function NodeConfig() {
  const formRef = useRef();
  return (
    <StepsForm.StepForm
      onFinish={async (v) => {
        console.log(v);

        return true;
      }}
      name="nodeConfig"
      title="节点配置"
      initialValues={{
        nodeVisitorWay: 'user',
      }}
      formRef={formRef}
    >
      <div className={styles.NodeConfig}>
        <ProFormRadio.Group
          name="nodeVisitorWay"
          label="节点访问授权"
          radioType="button"
          fieldProps={{
            className: styles.RadioButton,
          }}
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
                <Col span={isUser ? 9 : 9}>
                  <ProFormText
                    name="user"
                    fieldProps={{
                      autoComplete: 'off',
                    }}
                    rules={[requiredRule]}
                    label={'节点用户名'}
                  />
                </Col>

                {isUser && (
                  <Col span={9}>
                    <ProFormText.Password
                      fieldProps={{
                        autoComplete: 'new-password',
                      }}
                      rules={[requiredRule]}
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
                      rules={[requiredRule]}
                      name="password"
                      label={'节点私钥'}
                    />
                  </Col>
                )}
                <Col span={6}>
                  <ProFormDigit rules={[requiredRule]} name="sshPort" label={'节点SSH端口'} />
                </Col>
                {isUser && (
                  <Col span={24}>
                    <div className={styles.horizontalForm}>
                      <ProFormCheckbox
                        {...{
                          labelCol: { span: 6 },
                          wrapperCol: { span: 18 },
                        }}
                        name="savePassword"
                        label={'是否保存密码'}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            );
          }}
        </ProFormDependency>

        {nodeTypes.map((nodeType) => {
          return (
            <NodeFormList
              key={nodeType.key}
              nodeType={nodeType.key}
              title={`${nodeType.title} 节点:`}
            />
          );
        })}
        <AdvancedConfig></AdvancedConfig>
      </div>
    </StepsForm.StepForm>
  );
}
