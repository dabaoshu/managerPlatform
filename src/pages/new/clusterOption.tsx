import { ProFormText, StepsForm } from '@ant-design/pro-components';

export default function ClusterOption() {
  return (
    <StepsForm.StepForm name="clusterOption" title="集群选项">
      <div>
        <div>数据库配置</div>
        <ProFormText.Password label="数据库root用户密码" name="DBPassword" />
        <ProFormText label={'元数据存储目录'} name={['clickhouse', 'path']} />
        <ProFormText label={'保存查询过程中的临时数据'} name={['clickhouse', 'tmpPath']} />
        {/* <ProFormText label={'安装路径'} name={['clickhouse', 'path']} /> */}
      </div>
    </StepsForm.StepForm>
  );
}
