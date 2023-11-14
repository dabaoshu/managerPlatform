import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormFieldSet,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, Space, InputNumber, Input } from 'antd';
import { useHistory } from 'react-router';
import { DeleteOutlined, LeftOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.less';
import classnames from 'classnames';
import CardSelect from '@/components/cardSelect';

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
      <InputNumber onChange={onChange} controls={false} className={styles.number} value={value} />
      <Button onClick={() => onChange(value + 1)}>+</Button>
      {after}
    </Space>
  );
};

const ConditionItem = ({
  name = '',
  listFieldName = 'metrics',
  relationFieldName = 'relationField',
  relationList = [
    { label: '且', value: 'And' },
    { label: '或', value: 'Or' },
  ],
}) => {
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
        <ProFormDependency name={[[name, listFieldName]]}>
          {({ [name]: { [listFieldName]: list } }) => {
            return (
              <Form.Item noStyle name={[name, relationFieldName]} initialValue={'And'}>
                {list?.length > 1 && <Relation />}
              </Form.Item>
            );
          }}
        </ProFormDependency>

        <Form.List name={[name, listFieldName]} initialValue={[initialValue]}>
          {(fields, { remove, add: originAdd }) => {
            add = originAdd;
            return (
              <div className={styles['condition-content']}>
                {fields.map(({ key, name: fieldName, ...restField }) => (
                  <div key={key} className={styles['condition-item']}>
                    <Space size={4}>
                      <ProFormSelect
                        name={[fieldName, 'metric']}
                        formItemProps={{ noStyle: true }}
                        {...restField}
                        options={['OOO/11', 'jjj/lll', 'kkk']}
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
  { label: <div>企业微信群</div>, value: 'WeChat', title: '企业微信群机器人-Webhook' },
  { label: <div>飞书群</div>, value: 'Lark', title: '飞书群机器人-Webhook' },
  { label: <div>钉钉群 </div>, value: 'DingTalk', title: '钉钉群机器人-Webhook' },
  { label: <div>Webhook</div>, value: 'Webhook', title: 'Webhook' },
];

export default function AlarmNew() {
  const history = useHistory();
  const create = async () => {};
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
        <ProForm submitter={{ searchConfig: { submitText: '确定' } }} onFinish={create}>
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
          <ConditionItem name="condition" listFieldName="metrics" relationFieldName="trigger" />
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
