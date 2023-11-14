import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import styles from './index.less';
import { Button, Modal, Table, TableProps, message } from 'antd';
import { ModalPrompt } from '@/utils/prompt';
import FileUpload from './FileUpload';
import { useRequest } from 'ahooks';
import { PackageApi } from '@/services/package';
export default function PkgMgr() {
  const [list, setList] = useState([]);
  const { loading: versionLoading, refresh } = useRequest(PackageApi.getList, {
    defaultParams: ['all'],
    onSuccess: (res) => {
      if (res.isSuccess && Array.isArray(res.data)) {
        setList(res.data);
      }
    },
  });
  const remove = (item) => {
    Modal.confirm({
      title: `确认是否删除${item.pkgName}`,
      okText: '删除',
      onOk: async () => {
        const res = await PackageApi.deletePackage({
          packageVersion: item.version,
          pkgType: item.pkgType,
        });
        if (res && res.isSuccess) {
          message.success(`${item.version} 版本 删除 成功`);
          refresh();
        }
      },
    });
  };
  const columns: TableProps<any>['columns'] = [
    {
      dataIndex: 'version',
      title: '版本',
    },
    {
      title: '安装包类别',
      dataIndex: 'pkgType',
    },
    {
      title: '文件',
      dataIndex: 'pkgName',
    },
    {
      title: '操作',
      key: 'option',
      width: 130,
      render: (t, r) => [
        <a key="delete" onClick={() => remove(r)}>
          删除
        </a>,
      ],
    },
  ];

  const openUpFileModal = () => {
    ModalPrompt({
      props: {
        title: '上传安装包',
      },
      component: FileUpload,
      data: {},
    }).then(() => {
      refresh();
    });
  };

  return (
    <CsPage>
      <CsHeader
        leftRender={<div className={styles.pageTitle}>安装包管理</div>}
        extraRender={
          <Button type="primary" onClick={openUpFileModal}>
            上传安装包
          </Button>
        }
      />
      <CsContent>
        <div className={styles.section}>
          <Table columns={columns} loading={versionLoading} dataSource={list} rowKey="id" />
        </div>
      </CsContent>
    </CsPage>
  );
}
