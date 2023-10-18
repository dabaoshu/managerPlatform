import { ProFormRadio, ProFormSelect, ProFormText, StepsForm } from '@ant-design/pro-components';
import { Form } from 'antd';
import styles from './index.less';
import { useRequest, useSetState } from 'ahooks';
import { PackageApi } from '@/services/package';
export default function EnvConfig() {
  const [{ versionList }, setStatic] = useSetState({
    versionList: [
      {
        label: ' o.pkgName',
        value: ' o.pkgName',
      },
    ],
  });
  const { loading: versionLoading } = useRequest(PackageApi.getList, {
    defaultParams: ['all'],
    onSuccess: (res) => {
      if (res.isSuccess && Array.isArray(res.data)) {
        setStatic({
          versionList: res.data.map((o) => {
            return {
              label: o.pkgName,
              value: o.pkgName,
              ...o,
            };
          }),
        });
      }
    },
  });
  return (
    <StepsForm.StepForm
      name="envConfig"
      title="环境配置"
      initialValues={{
        createWay: 'new',
        clusterName: 'clusterName',
      }}
    >
      <div>
        <ProFormText
          label="集群名称"
          name={'clusterName'}
          extra="必须字母开头，最多 64 个字符，可以使用字母（大小写不敏感）、数字和_"
          rules={[
            {
              required: true,
              message: '格式不匹配',
              pattern: /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/,
            },
          ]}
        />
        <ProFormRadio.Group
          name="createWay"
          label="新建方式"
          radioType="button"
          fieldProps={{
            className: styles.RadioButton,
          }}
          options={[
            {
              label: '部署新集群',
              value: 'new',
            },
            {
              label: '接管现有集群',
              value: 'old',
            },
          ]}
        />
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) => prevValues.createWay !== curValues.createWay}
        >
          {(form) => {
            const hidden = form.getFieldValue('createWay') !== 'new';
            if (hidden) {
              return null;
            }
            return (
              <ProFormSelect
                fieldProps={{ loading: versionLoading }}
                label="版本"
                name="packageVersion"
                preserve={false}
                options={versionList}
                dependencies={['createWay']}
                rules={[
                  {
                    required: true,
                    message: '请选择',
                  },
                ]}
              />
            );
          }}
        </Form.Item>
      </div>
    </StepsForm.StepForm>
  );
}
