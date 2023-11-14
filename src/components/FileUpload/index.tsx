import React, { useCallback, useState } from 'react';
import { Upload, Button, Input, message } from 'antd';
// import { formatMessage } from 'umi/locale';
import { UploadFile } from 'antd/es/upload/interface';
import classnames from 'classnames';
import styles from './index.less';
import { useIntl } from 'umi';

const LimitFileSize = (file: File, limitSize: number) => {
  if (!(file instanceof File)) {
    message.error('非文件类型');
    return false;
  }
  if (!!limitSize && typeof limitSize === 'number') {
    if (file.size < limitSize * 1024 * 1024) {
      return true;
    }
    message.error(`File must smaller than ${limitSize}MB!`);
  }
  return false;
};

function FileUpload(props) {
  const { onChange, value, disabled: _disabled, className, size = 2 } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = (file) => {
    if (LimitFileSize(file, Number(size))) {
      setFileList([file]);
    }
    return false;
  };

  const onRemove = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList([...newFileList]);
  };

  return (
    <div className={classnames(styles.FileUpload, className)}>
      <div className={styles.Upload}>
        <Upload
          fileList={fileList}
          beforeUpload={beforeUpload}
          onRemove={onRemove}
          disabled={_disabled}
        >
          <Button>上传文件</Button>
        </Upload>
      </div>
    </div>
  );
}
export default FileUpload;
