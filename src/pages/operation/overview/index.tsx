import { ClusterApi } from '@/services/cluster';
import { useMount, useRequest, useSetState } from 'ahooks';
import { Col, Row, Space, Divider, Spin, Table, Descriptions, DescriptionsProps } from 'antd';
import { useMemo, type FC } from 'react';
import styles from './index.less';
type Static = { total: number; run: number; stop: number };
const InfoText: FC<{ item: Partial<Static>; count?: boolean }> = ({ item, count = true }) => {
  const { total = 0, run = 0, stop = 0 } = item;
  return (
    <div className={styles.infoText}>
      <span className={styles.text}>{run}</span>
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
            <span>总数</span>
            <span>{total}</span>
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
      dataIndex: 'way',
    },
    {
      title: '访问地址',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '连接串',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  const dataSource = useMemo(() => {
    const list = [{ way: '' }];
  }, [data]);
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
      children: data.run_time,
    },
  ];
  return (
    <div className={styles.baseInfoCard}>
      <Descriptions className={styles.baseDesc} title="基础信息" layout="vertical" items={items} />
    </div>
  );
};

export default function Overview() {
  // const [{ user, loading }] = useModel('clusterModel');
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
  });
  const { loading } = useRequest(ClusterApi.getstatics, {
    onSuccess: (res) => {
      if (res.isSuccess && res.data) {
        setData(res.data);
      }
    },
  });
  useMount(() => {
    ClusterApi.getstatics();
  });
  return (
    <div className={styles.overview}>
      <Spin spinning={loading}>
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
              <InfoText item={{ run: data.tableCount }} count={false} />
            </InfoCard>
          </Col>
          <Col span={8}>
            <InfoCard title={'数据库数量'}>
              <InfoText item={{ run: data.dbCount }} count={false} />
            </InfoCard>
          </Col>
        </Row>
        {/* <ConnetCard data={data}></ConnetCard> */}
        <BaseInfoCard data={data}></BaseInfoCard>
      </Spin>
    </div>
  );
}
