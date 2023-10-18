import { ProFormText, StepsForm } from '@ant-design/pro-components';
import React from 'react';

export default function ClusterOption() {
  return (
    <StepsForm.StepForm name="clusterOption" title="集群选项">
      <div>
        <div>数据库配置</div>
        <ProFormText.Password label="数据库root用户密码" name="rootpassWord" />
        <ProFormText label={'安装路径'} name="path"></ProFormText>
      </div>
    </StepsForm.StepForm>
  );
}
