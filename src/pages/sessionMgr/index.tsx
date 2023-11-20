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

const mock = [
  {
    startTime: 1700035020,
    queryDuration: 28,
    query:
      "aSELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    databaseSELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    databaseSELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: '6bd6d358-2156-465c-8bf9-9d0e65404df5',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700011620,
    queryDuration: 22,
    query:
      "abSELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: '0dd7c07f-691f-43ae-9b45-8edcf82bf320',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700023500,
    queryDuration: 17,
    query:
      "aabSELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: 'a020077d-574c-4643-9ef1-e5d5397bf772',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700011800,
    queryDuration: 14,
    query:
      "SELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: 'b576469f-ee42-496d-9292-c4afcdfa1f0d',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700021580,
    queryDuration: 14,
    query:
      "SELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: '8a48eb8d-4a88-474d-b49e-096c66927ac4',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700022900,
    queryDuration: 13,
    query:
      "cSELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: '481c48cf-333c-4469-a0a0-82a45d563129',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700024340,
    queryDuration: 199,
    query:
      "aSELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: 'f4e443e3-2ccb-47fb-97d5-ee0e94d549f7',
    address: '127.0.0.1',
    threads: 32,
    host: 'localhost',
  },
  {
    startTime: 1700022360,
    queryDuration: 13,
    query:
      "SELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: '0295cb5d-3a25-4ae6-b628-ceea46d06492',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700032692,
    queryDuration: 13,
    query:
      "SELECT\n    partition,\n    sum(rows),\n    sum(data_compressed_bytes),\n    sum(data_uncompressed_bytes),\n    min(min_time),\n    max(max_time),\n    disk_name\nFROM system.parts\nWHERE (database = 'BAS') AND (table = 'BAS_PRD_JDYX_INFO_L')\nGROUP BY\n    partition,\n    disk_name\nORDER BY partition ASC",
    user: 'default',
    queryId: '7f8e749f-d0d4-418a-ae69-aea2ddead170',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
  {
    startTime: 1700034960,
    queryDuration: 12,
    query:
      "SELECT\n    t2.database AS database,\n    t2.name AS table,\n    groupArray(t1.name) AS rows\nFROM system.columns AS t1\nINNER JOIN\n(\n    SELECT\n        database,\n        name\n    FROM system.tables\n    WHERE match(engine, 'Distributed') AND (database NOT IN ('system', 'information_schema', 'INFORMATION_SCHEMA') )\n) AS t2 ON t1.table = t2.name and t1.database=t2.database\nGROUP BY\n    database,\n    table\nORDER BY \n    database",
    user: 'default',
    queryId: '08453ccf-80d6-46f4-bba7-a354ac066616',
    address: '127.0.0.1',
    threads: 34,
    host: 'localhost',
  },
];

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
          // list={openData?.data}
          list={mock}
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
          // list={closeData?.data}
          list={mock}
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
