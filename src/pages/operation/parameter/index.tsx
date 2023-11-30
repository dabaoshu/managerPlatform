import { useMemo } from 'react';
import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { Button, Space, Table, Tabs, Form } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import styles from './index.less';
import { ProForm } from '@ant-design/pro-components';
import { useMount, useRequest, useSetState } from 'ahooks';
import { ClusterApi } from '@/services/cluster';
import { useIntl, useModel } from 'umi';
import { ModalPrompt } from '@/utils/prompt';
import { generateList } from './utils';
import ParameTree from './ParameTree';

const LeftRender = () => {
  const history = useHistory();
  return (
    <Space size={8} className={styles.LeftRender}>
      <div className={styles.backIcon}>
        <LeftOutlined
          onClick={() => {
            history.push({
              pathname: '/operation/nodes',
            });
          }}
        />
      </div>
      <div className={styles.title}>参数配置</div>
    </Space>
  );
};
interface Param {
  paramName: string; //参数名
  paramValue: any; //参数运行值
  paramType: string; //参数类别
  paramDesc: string; //参数描述
  updatedParamValue?: any;
}

export default function Parameter() {
  const { locale } = useIntl();
  const [editableFormRef] = Form.useForm();
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');

  const [{ tabKey, uiConfig }, setState] = useSetState({
    tabKey: undefined,
    editType: false,
    originDataSource: {} as Record<string, Param[]>,
    uiConfig: {},
  });
  const { loading: uiLoading } = useRequest(ClusterApi.getClusterParamsUi, {
    defaultParams: [{ type: 'settings' }],
    onSuccess: (res) => {
      if (res.isSuccess && res.data) {
        let obj = {};
        try {
          obj = JSON.parse(res.data);
        } catch (error) {}

        setState({
          tabKey: obj[0]?.field_name,
          uiConfig: obj,
        });
      }
    },
  });

  const tabOption = useMemo(() => {
    const isZh = locale === 'zh-CN';
    const label = isZh ? 'label_zh' : 'label_en';
    const desc = isZh ? 'description_zh' : 'description_en';
    if (Array.isArray(uiConfig)) {
      return uiConfig.map((o) => {
        return {
          label: o[label],
          desc: o[desc],
          key: o.field_name,
        };
      });
    }
    return [];
  }, [uiConfig, locale]);

  const uiList = useMemo(() => {
    if (Array.isArray(uiConfig)) {
      const target = uiConfig.filter((o) => o.field_name === tabKey);
      return generateList(target);
    }
    return [];
  }, [uiConfig, tabKey]);

  const { loading: getLoading, refresh: getClusterConfig } = useRequest(
    ClusterApi.getClusterConfig,
    {
      onSuccess: (res) => {
        if (res.isSuccess) {
          console.log(res.data);
        }
      },
      defaultParams: [clusterName],
    },
  );
  const loading = uiLoading || getLoading;
  // const { loading: saveLoading, runAsync: saveClusterConfig } = useRequest(
  //   ClusterApi.saveClusterConfig,
  //   {
  //     manual: true,
  //     onSuccess: (res) => {
  //       if (res.isSuccess) {
  //         console.log(res.data);
  //       }
  //     },
  //   },
  // );

  const onCancel = () => {
    setState({ editType: false });
    editableFormRef.resetFields();
  };

  const onTabChange = (activeKey) => {
    onCancel();
    setState({ tabKey: activeKey });
  };

  console.log(uiList);

  return (
    <CsPage>
      <CsHeader leftRender={<LeftRender />} />
      <Tabs
        activeKey={tabKey}
        onChange={onTabChange}
        items={tabOption}
        animated={false}
        className={styles.tabs}
      />
      <CsContent className={styles.parameterCsContent}>
        <ProForm layout="vertical" wrapperCol={{ span: 18 }} form={editableFormRef}>
          <ParameTree ParamList={uiList} />
        </ProForm>
      </CsContent>
    </CsPage>
  );
}
