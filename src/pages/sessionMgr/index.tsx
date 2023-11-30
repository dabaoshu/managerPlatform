import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import { useRef, useState } from 'react';
import styles from './index.less';
import SqlSession from './SqlSession';
import { Badge, InputNumber, Form } from 'antd';
import { useIntl, useModel } from 'umi';
import { useMount, useRequest } from 'ahooks';
import { SessionApi } from '@/services/session';
import { convertTimeBounds } from '@/utils/time';
import type { TimeFilterRef } from '@/components/timeFilter';
import { TimeFilter } from '@/components/timeFilter';

export default function SessionMgr() {
  const { formatMessage } = useIntl();
  const [slowLimit, setSlowLimit] = useState(10);
  const [
    {
      currentCluster: { clusterName },
    },
  ] = useModel('clusterModel');
  const {
    loading: closeLoading,
    run: closeFetch,
    data: closeData,
  } = useRequest(SessionApi.close, { manual: true });
  const timeFilterRef = useRef<TimeFilterRef>();
  // const [timeFilter, setTimeFilter] = useState({});
  const getSlowSessionList = () => {
    const timeFilter = timeFilterRef.current.getValues();
    const { start, end } = convertTimeBounds(timeFilter);
    closeFetch(clusterName, {
      limit: slowLimit,
      start: parseInt(`${start / 1000}`),
      end: parseInt(`${end / 1000}`),
    });
  };
  const {
    loading: openLoading,
    refreshAsync: reOpenFetch,
    data: openData,
  } = useRequest(SessionApi.open, {
    defaultParams: [clusterName],
    onSuccess: (res) => {
      if (res.isSuccess) {
        getSlowSessionList();
      }
    },
  });

  return (
    <CsPage>
      <CsHeader
        leftRender={
          <div className={styles.title}>
            {formatMessage({ id: 'session.Sessions Management', defaultMessage: '会话管理' })}
          </div>
        }
      />
      <CsContent>
        <SqlSession
          type="open"
          list={openData?.data}
          loading={openLoading}
          title={
            <Badge
              status={'success'}
              text={formatMessage({
                id: 'session.Open Sessions',
                defaultMessage: '正在执行的SQL会话',
              })}
            />
          }
          reload={() => reOpenFetch()}
          toolActions={[]}
        />
        <SqlSession
          type="close"
          list={closeData?.data}
          loading={closeLoading}
          title={
            <Badge
              status="warning"
              text={formatMessage({
                id: 'session.Slow Sessions',
                defaultMessage: '慢sql查询',
              })}
            />
          }
          toolActions={[
            <Form.Item key={'limit'} style={{ marginBottom: 0 }} label="查询条数">
              <InputNumber
                onPressEnter={() => getSlowSessionList()}
                value={slowLimit}
                onChange={(v) => setSlowLimit(v)}
              />
            </Form.Item>,
            <TimeFilter
              key={'timefilter'}
              ref={timeFilterRef}
              defaultValue={0}
              onOk={() => {
                getSlowSessionList();
              }}
            />,
          ]}
          reload={getSlowSessionList}
        />
      </CsContent>
    </CsPage>
  );
}
