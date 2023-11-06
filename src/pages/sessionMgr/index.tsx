import { CsContent, CsHeader, CsPage } from '@/components/CsPage';
import React, { useState } from 'react';
import styles from './index.less';
import SqlSession from './SqlSession';
import { Badge } from 'antd';
import { useIntl, useModel } from 'umi';
import { useMount, useRequest, useSetState } from 'ahooks';
import { SessionApi } from '@/services/session';
import { convertTimeBounds } from '@/utils/time';
import { TimeFilter } from '@/components/timeFilter';
export default function SessionMgr() {
  const { formatMessage } = useIntl();
  const [{ currentCluster }] = useModel('clusterModel');
  const {
    loading: closeLoading,
    run: closeFetch,
    data: closeData,
  } = useRequest(SessionApi.close, { manual: true });
  const [timeFilter, setTimeFilter] = useState({});
  const getSlowSessionList = () => {
    const { min, max } = convertTimeBounds(timeFilter);
    const { limit, id } = this;
    closeFetch(id, {
      limit,
      start: parseInt(min / 1000),
      end: parseInt(max / 1000),
    });
  };
  const {
    loading: openLoading,
    refresh: openReFresh,
    data: openData,
  } = useRequest(SessionApi.open, {
    defaultParams: [currentCluster.clusterName],
    onSuccess: (res) => {
      if (res.isSuccess) {
        getSlowSessionList();
      }
    },
  });

  const onFilter = (val) => {
    setTimeFilter(val);
  };

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
          reload={openReFresh}
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
          toolActions={[<TimeFilter defaultValue={0} onOk={() => {}} />]}
          reload={getSlowSessionList}
        />
      </CsContent>
    </CsPage>
  );
}
