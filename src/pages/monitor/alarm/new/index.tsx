import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Space, InputNumber, App } from 'antd';
import { useHistory } from 'react-router';
import { DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './index.less';
import classnames from 'classnames';
import CardSelect from '@/components/cardSelect';
import { useRequest } from 'ahooks';
import { AlarmApi } from '@/services/alarm';
import { useModel } from 'umi';

const DigitItem = ({
  value = 0,
  onChange,
  after = null,
}: {
  value?: number;
  onChange?: (value: number) => void;
  after: React.ReactNode;
}) => {
  return (
    <Space size={4}>
      <Button onClick={() => onChange(value - 1)}>-</Button>
      <InputNumber
        onChange={onChange}
        min={0}
        controls={false}
        className={styles.number}
        value={value}
      />
      <Button onClick={() => onChange(value + 1)}>+</Button>
      {after}
    </Space>
  );
};

const metricList = [
  'tso_down',
  'worker_write_down',
  'resource_manager_down',
  'server_down',
  'damon_manager_down',
  'fdb_down',
];

const ConditionItem = ({
  name = '',
  relationFieldName = 'relationField',
  relationList = [
    { label: '且', value: 'And' },
    { label: '或', value: 'Or' },
  ],
}) => {
  const form = Form.useFormInstance();

  const initialValue = { op: '>=', right_value: 50 };
  const Relation = ({ value, onChange }: any) => {
    return (
      <div className={styles['condition-relation']}>
        {relationList.map((o) => (
          <span
            key={o.value}
            className={classnames(styles['relation-item'], {
              [styles['relation-item-active']]: value === o.value,
            })}
            onClick={() => {
              onChange(o.value);
            }}
          >
            {o.label}
          </span>
        ))}
      </div>
    );
  };

  let add: any = () => {};

  return (
    <div className={styles.condition1}>
      <div className={styles['condition-input-content']}>
        <ProFormDependency name={[[name]]}>
          {({ [name]: list }) => {
            return (
              <Form.Item noStyle name={[relationFieldName]} initialValue={'And'}>
                {list?.length > 1 && <Relation />}
              </Form.Item>
            );
          }}
        </ProFormDependency>

        <Form.List name={[name]} initialValue={[initialValue]}>
          {(fields, { remove, add: originAdd }) => {
            add = originAdd;
            const values = form.getFieldValue([name]) || [];
            const metrics = values.map((o) => o.metric).filter((o) => !!o);
            const List = metricList.filter((o) => !metrics.includes(o));
            return (
              <div className={styles['condition-content']}>
                {fields.map(({ key, name: fieldName, ...restField }) => (
                  <div key={key} className={styles['condition-item']}>
                    <Space size={4}>
                      <ProFormSelect
                        fieldProps={{
                          style: { width: 260 },
                        }}
                        name={[fieldName, 'metric']}
                        formItemProps={{ noStyle: true }}
                        {...restField}
                        options={List}
                      />
                      <ProFormSelect
                        name={[fieldName, 'op']}
                        formItemProps={{ noStyle: true }}
                        {...restField}
                        options={['>', '>=', '<', '<=', '==', '!=']}
                      />
                      <ProFormDigit
                        name={[fieldName, 'right_value']}
                        formItemProps={{ noStyle: true }}
                      />
                      {fields.length > 1 && (
                        <div className={styles['condition-item-oper']}>
                          <Button
                            type="text"
                            onClick={() => {
                              remove(fieldName);
                            }}
                            icon={<DeleteOutlined />}
                          />
                        </div>
                      )}
                    </Space>
                  </div>
                ))}
              </div>
            );
          }}
        </Form.List>
      </div>
      <Button type="link" onClick={() => add(initialValue)}>
        + 添加条件
      </Button>
    </div>
  );
};

const AlarmList = [
  { label: <div>邮箱</div>, value: 'Email', title: '邮箱-告警对象' },
  // { label: <div>企业微信群</div>, value: 'WeChat', title: '企业微信群机器人-Webhook' },
  // { label: <div>飞书群</div>, value: 'Lark', title: '飞书群机器人-Webhook' },
  { label: <div>钉钉群 </div>, value: 'DingTalk', title: '钉钉群机器人-Webhook' },
  // { label: <div>Webhook</div>, value: 'Webhook', title: 'Webhook' },
];

export default function AlarmNew() {
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const history = useHistory();
  const { message } = App.useApp();
  const { loading, runAsync } = useRequest(AlarmApi.createAlarm, {
    manual: true,
    onSuccess: (res) => {
      if (res.isSuccess) {
        message.success('创建成功');
        history.push({ pathname: '/alarm/tactics', state: { refresh: true } });
      }
    },
  });

  const create = async (value) => {
    runAsync(clusterName, value);
    history.push({ pathname: '/monitor/alarm/tactics', state: { refresh: true } });
  };
  return (
    <CsPage>
      <CsHeader
        leftRender={
          <Space size={8} className={styles.LeftRender}>
            <div className={styles.backIcon}>
              <LeftOutlined
                onClick={() => {
                  history.push({
                    pathname: '/monitor/alarm/tactics',
                  });
                }}
              />
            </div>
            <div className={styles.title}>新建告警策略</div>
          </Space>
        }
      />
      <CsContent>
        <ProForm
          submitter={{ searchConfig: { submitText: '确定' } }}
          loading={loading}
          onFinish={create}
        >
          <ProFormText name={'name'} width={'md'} label="告警名称" />
          <Form.Item label="触发条件">
            <Space size={8}>
              <div>最近</div>
              <Form.Item name={['duration', 'number']} initialValue={0} noStyle>
                <DigitItem
                  after={
                    <ProFormSelect
                      name={['duration', 'unit']}
                      formItemProps={{ noStyle: true }}
                      fieldProps={{
                        size: 'middle',
                        allowClear: false,
                      }}
                      initialValue={'second'}
                      options={[
                        { label: '秒', value: 'second' },
                        { label: '分钟', value: 'minute' },
                        { label: '小时', value: 'hour' },
                      ]}
                    />
                  }
                />
              </Form.Item>

              <div>， 满足以下条件 ：</div>
            </Space>
          </Form.Item>
          <ConditionItem name="condition" relationFieldName="trigger" />
          <Form.Item label="通知">
            <Form.Item name={'interval'} initialValue={0} noStyle>
              <DigitItem after="分钟" />
            </Form.Item>
            <Form.Item label={'告警方式'} name={'notifications'}>
              <CardSelect options={AlarmList} className={styles.AlarmList} />
            </Form.Item>
          </Form.Item>
          <ProFormDependency name={['notifications']}>
            {({ notifications = [] }) => {
              return AlarmList.filter((o) => notifications.includes(o.value)).map((o) => {
                return <ProFormText name={['warnType', o.value]} key={o.value} label={o.title} />;
              });
            }}
          </ProFormDependency>
        </ProForm>
      </CsContent>
    </CsPage>
  );
}
