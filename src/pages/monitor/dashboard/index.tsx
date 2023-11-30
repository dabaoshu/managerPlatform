import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { MonitorLeftRender } from '../components/MonitorLeftRender';
import styles from './index.less';
import { Metrics } from './Metrics';
import { Row, Col } from 'antd';
import { MetricApi } from '@/services/metric';
import { useModel } from 'umi';
import { useRequest, useSetState } from 'ahooks';
import { useMemo, useState } from 'react';
import { MetricData, transChartOption } from './chartOption';
import { Line } from '@ant-design/plots';
const DashboardChart = ({ chartItem, title, duration, min, max }) => {
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  console.log(clusterName);

  const { expect, metric } = chartItem;
  const [chartData, setChartData] = useState<MetricData[]>();
  const { loading, runAsync } = useRequest<API.BaseRes<MetricData[]>, any>(
    MetricApi.queryRangeMetric,
    { manual: true },
  );
  const fetchData = async () => {
    const step = Math.floor(+duration / 360 / 1000);
    const { data, isSuccess } = await runAsync(clusterName, {
      title: title,
      metric: metric,
      start: Math.floor(min / 1000),
      end: Math.floor(max / 1000),
      step,
    });
    if (isSuccess) {
      setChartData(data);
    }
  };

  const config = useMemo(() => {
    return transChartOption(chartData, min, max);
  }, [chartData, min, max]);

  return (
    <div className={styles.dashboardChart}>
      <div className={styles.title}>{expect}</div>
      <div className={styles.charContent}>
        <Line {...config} />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [{ duration, min, max }, setState] = useSetState({
    duration: 3600,
    min: 0,
    max: 0,
  });

  return (
    <CsPage>
      <CsHeader leftRender={<MonitorLeftRender />} />
      <CsContent>
        <main>
          {Metrics.map((item, index) => {
            return (
              <section key={item.title}>
                <header className={styles.title}>
                  <span>{item.title}</span>
                  <span>timeFilter</span>
                </header>
                <div>
                  <Row gutter={[16, 16]}>
                    {item.metrics.map((o) => {
                      return (
                        <Col span={8} key={o.metric}>
                          <DashboardChart
                            title={item.title}
                            key={o.expect}
                            chartItem={o}
                            duration={duration}
                            min={min}
                            max={max}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </section>
            );
          })}
        </main>
      </CsContent>
    </CsPage>
  );
}
