import { ipPattern } from '@/utils/regex';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import _ from 'lodash';

export function BatchIpCreateModal({ title, trigger, onFinish, list }) {
  return (
    <ModalForm
      width={450}
      title={title}
      trigger={trigger}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        bodyStyle: {
          padding: 0,
          margin: '20px 0',
        },
        onCancel: () => console.log('run'),
      }}
      onFinish={async ({ ips }) => {
        const iplist = ips?.trim()?.split('\n');
        onFinish(iplist);
        return true;
      }}
    >
      <ProFormTextArea
        name={'ips'}
        fieldProps={{
          rows: 5,
        }}
        placeholder={`请输入 IP，多个 IP 之间换行分割。
示例：
142.123.45.23
143.23.12.32
143.23.11.33`}
        validateTrigger={[]}
        rules={[
          {
            // pattern: ipPattern,
            // message: 'IP 地址格式不正确',
            required: true,
            validator: async (rule, value: string) => {
              try {
                const ipList = value?.trim()?.split('\n');
                const next = ipList.every((ip) => ipPattern.test(ip));
                if (!next) return Promise.reject('IP 地址格式不正确');
                const repeat = list.some((ip) => ipList.includes(ip));
                if (repeat) return Promise.reject('节点 IP 重复');
                const newIplist = _.uniq(ipList);
                if (newIplist.length > 0 && newIplist.length !== ipList.length) {
                  return Promise.reject('新增的节点IP重复');
                }
              } catch (error) {
                return Promise.reject('IP 地址格式不正确');
              }
              return Promise.resolve();
            },
          },
        ]}
      />
    </ModalForm>
  );
}
