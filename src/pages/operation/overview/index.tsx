import { ClusterApi } from '@/services/cluster';
import { useMount, useRequest, useSetState } from 'ahooks';
import { Col, Row, Space, Divider, Spin, Table, Descriptions, DescriptionsProps } from 'antd';
import { useMemo, type FC } from 'react';
import styles from './index.less';
import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { OperationLeftRender } from '../components/OperationLeftRender';
import { OperationExtraRender } from '../components/OperationExtraRender';
import { useModel } from 'umi';
type Static = { total: number; run: number; stop: number };
const InfoText: FC<{ item: Partial<Static>; count?: boolean }> = ({ item, count = true }) => {
  const { total = 0, run = 0, stop = 0 } = item;
  return (
    <div className={styles.infoText}>
      <span className={styles.text}>{total}</span>
      {count && (
        <div className={styles.count}>
          <Space size={8}>
            <span>运行中</span>
            <span>{run}</span>
          </Space>
          <Divider type="vertical" />
          <Space size={8}>
            <span>失效</span>
            <span>{stop}</span>
          </Space>
          <Divider type="vertical" />
          <Space size={8}>
            <span>其他</span>
            <span>{total - run - stop}</span>
          </Space>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ title, children }) => {
  return (
    <div className={styles.infoCard}>
      <div className={styles.label}>{title}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

const ConnetCard = ({ data }) => {
  const columns = [
    {
      title: '访问方式',
      dataIndex: 'accessMethod',
    },
    {
      title: '访问地址',
      dataIndex: 'address',
    },
    {
      title: '连接串',
      dataIndex: 'connectString',
    },
  ];

  return (
    <div className={styles.connectCard}>
      <div className={styles.title}>连接信息</div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

const BaseInfoCard = ({ data }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '创建时间',
      children: data.createTime,
    },
    {
      key: '2',
      label: '启动时间',
      children: data.startTime,
    },
    {
      key: '3',
      label: '运行时间',
      children: data.runTime,
    },
  ];
  return (
    <div className={styles.baseInfoCard}>
      <Descriptions className={styles.baseDesc} title="基础信息" layout="vertical" items={items} />
    </div>
  );
};

export default function Overview() {
  const [{ currentCluster }] = useModel('clusterModel');
  const [data, setData] = useSetState({
    serverStatics: {},
    resourcemanagerStatics: {},
    tsoStatics: {},
    daemonStatics: {},
    workerWriterStatics: {},
    workerStatics: {},
    fdbStatics: {},
    dbCount: 0,
    tableCount: 0,
    accessInfo: [],
    createTime: '',
    startTime: '',
    runTime: '',
  });
  const { loading } = useRequest(ClusterApi.getstatics, {
    defaultParams: [currentCluster.clusterName],
    onSuccess: (res) => {
      if (res.isSuccess && res.data) {
        setData(res.data);
      }
    },
    pollingInterval: 3000,
    pollingWhenHidden: false,
  });

  return (
    <CsPage>
      <CsHeader leftRender={<OperationLeftRender />} extraRender={<OperationExtraRender />} />
      <CsContent>
        <div className={styles.overview}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <InfoCard title={'SERVER统计'}>
                <InfoText item={data.serverStatics} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'RM统计'}>
                <InfoText item={data.resourcemanagerStatics} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'TSO统计'}>
                <InfoText item={data.tsoStatics} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'DAEMON统计'}>
                <InfoText item={data.daemonStatics} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'写worker统计'}>
                <InfoText item={data.workerWriterStatics} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'读worker统计'}>
                <InfoText item={data.workerStatics} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'Fdb统计'}>
                <InfoText item={data.fdbStatics} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'表数量'}>
                <InfoText item={{ total: data.tableCount }} count={false} />
              </InfoCard>
            </Col>
            <Col span={8}>
              <InfoCard title={'数据库数量'}>
                <InfoText item={{ total: data.dbCount }} count={false} />
              </InfoCard>
            </Col>
          </Row>
          <ConnetCard data={data.accessInfo}></ConnetCard>
          <BaseInfoCard data={data}></BaseInfoCard>
        </div>
      </CsContent>
    </CsPage>
  );
}
