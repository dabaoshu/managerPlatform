import { TablesApi } from '@/services/tables';
import { requiredRule } from '@/utils/form';
import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';

const exportFormatOptions = [
  { label: 'CSV', value: 'CSV' },
  { label: 'ORC', value: 'ORC' },
  { label: 'Parquet', value: 'Parquet' },
];

const targetOptions = [
  { label: 'local', value: 'local' },
  { label: 'hdfs', value: 'hdfs' },
  { label: 's3', value: 's3' },
];

const compressionOptions = [
  { label: 'none', value: 'none' },
  { label: 'gzip', value: 'gzip' },
  { label: 'gz', value: 'gz' },
  { label: 'brotli', value: 'brotli' },
  { label: 'br', value: 'br' },
  { label: 'xz', value: 'xz' },
  { label: 'LZMA', value: 'LZMA' },
  { label: 'zstd', value: 'zstd' },
  { label: 'zst', value: 'zst' },
];

const ArchiveModal = forwardRef<
  { onOk: () => Promise<string> },
  { database: string; tables: string; clusterName: string }
>(({ database, tables, clusterName }, ref) => {
  const [form] = Form.useForm();
  const onOk = async () => {
    const values = await form.validateFields();
    const [begin, end] = values.timeRange;
    const params = {
      ...values,
      database,
      tables,
      begin,
      end,
    };

    delete params.timeRange;
    const { isSuccess, data } = await TablesApi.archiveTables(clusterName, params);
    if (isSuccess) {
      return data;
    }
    return;
  };
  useImperativeHandle(ref, () => {
    return {
      onOk,
    };
  });
  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        format: 'CSV',
        maxfilesize: 1000000000,
        target: 'local',
        local: {
          path: '',
        },
        hdfs: {
          addr: '',
          user: '',
          dir: '',
        },
        s3: {
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
          region: '',
          bucket: '',
          compression: 'gzip',
        },
      }}
    >
      <ProFormDateRangePicker
        fieldProps={{
          format: 'YYYY-MM-DD',
        }}
        rules={[requiredRule]}
        label={'时间范围'}
        name={'timeRange'}
      />
      <ProFormSelect
        rules={[requiredRule]}
        label="导出格式"
        name={'format'}
        options={exportFormatOptions}
      />
      <ProFormDigit rules={[requiredRule]} label="最大时间片" name={'maxfilesize'} />
      <ProFormSelect
        rules={[requiredRule]}
        label="备份目标"
        name={'target'}
        options={targetOptions}
      />
      <ProFormDependency name={['target']}>
        {({ target }) => {
          if (target === 'local') {
            return <ProFormText label="路径" rules={[requiredRule]} name={['local', 'Path']} />;
          } else if (target === 'hdfs') {
            return (
              <>
                <ProFormText label="地址" rules={[requiredRule]} name={['hdfs', 'addr']} />
                <ProFormText label="用户" rules={[requiredRule]} name={['hdfs', 'user']} />
                <ProFormText label="目录" rules={[requiredRule]} name={['hdfs', 'dir']} />
              </>
            );
          } else if (target === 's3') {
            return (
              <>
                <ProFormText label="Endpoint" name={['s3', 'endpoint']} />
                <ProFormText label="AccessKeyID" name={['s3', 'accessKeyId']} />
                <ProFormText label="SecretAccessKey" name={['s3', 'secretAccessKey']} />
                <ProFormText label="Region" name={['s3', 'region']} />
                <ProFormText label="Bucket" name={['s3', 'bucket']} />
                <ProFormSelect
                  label="压缩格式"
                  name={['s3', 'compression']}
                  options={compressionOptions}
                />
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>
    </Form>
  );
});
export default ArchiveModal;
