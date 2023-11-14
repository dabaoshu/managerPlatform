import { PackageApi } from '@/services/package';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, UploadFile, Progress, message } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

const FileUpload = forwardRef((props, ref) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const onProgress = (obj) => {
    setProgress(obj.progress * 100);
  };

  const onOk = async () => {
    if (fileList.length) {
      const resAll = (fileList || []).map((file) => {
        const formData = new FormData();
        formData.append('package', file);
        return PackageApi.upload(formData, onProgress).then((res) => {
          if (res.retCode === '0000') {
            message.success('上传成功');
          }
        });
      });
      return await Promise.all(resAll);
    }
    return false;
  };

  const beforeUpload = (file) => {
    setFileList([file]);
    return false;
  };
  const onRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList([...newFileList]);
  };

  useImperativeHandle(ref, () => {
    return { onOk };
  });
  return (
    <div>
      <Upload
        fileList={fileList}
        beforeUpload={beforeUpload}
        // maxCount={1}
        onRemove={onRemove}
        accept=".rpm, .deb, .tgz"
        // progress={{
        //   strokeColor: {
        //     '0%': '#108ee9',
        //     '100%': '#87d068',
        //   },
        //   strokeWidth: 3,
        //   format: (percent) => {
        //     console.log('percent', percent);
        //     return percent && `${parseFloat(percent.toFixed(2))}%`;
        //   },
        // }}
      >
        <Button icon={<UploadOutlined />}>上传安装包</Button>
      </Upload>
      {progress > 0 && (
        <Progress
          format={(percent) => {
            console.log('percent', percent);
            return percent && `${parseFloat(percent.toFixed(2))}%`;
          }}
          strokeWidth={3}
          percent={progress}
        ></Progress>
      )}
    </div>
  );
});
export default FileUpload;
