import { SqlQueryApi } from '@/services/sqlQuery';
import { useSetState } from 'ahooks';
import React from 'react';
import { useModel } from 'umi';

const QueryExecutionContext = React.createContext<{
  state: { historyList: any[] };
  retrieveHistory: (clusterName: string) => void;
  deleteHistory: (payload: { checkSum: string; clusterName: string }) => void;
  setSatus: (staus: string) => void;
  setResult: (result: any[]) => void;
}>({
  state: {
    historyList: [],
  },
  retrieveHistory: function (): void {
    throw new Error('Function not implemented.');
  },
  deleteHistory: function (payload: { checkSum: string; clusterName: string }): void {
    throw new Error('Function not implemented.');
  },
});

export const useQueryExecutionContext = () => React.useContext(QueryExecutionContext);
export const QueryExecutionContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setConText] = useSetState({
    historyList: [],
    result: [],
    status: '',
    queryDuration: 0,
  });

  const deleteHistory = ({ checksum, clusterName }) => {
    const historyList = state.historyList.filter((x) => {
      return !(x.Cluster === clusterName && x.CheckSum === checksum);
    });
    setConText({
      historyList,
    });
  };

  const retrieveHistory = async (clusterName) => {
    const { data, isSuccess } = await SqlQueryApi.getHistory(clusterName);
    if (isSuccess) {
      setConText({
        historyList: data,
      });
    }
  };

  const setResult = (data) => {
    setConText({
      result: data,
    });
  };

  const setStatus = (status) => {
    setConText({
      status,
    });
  };
  const setQueryDuration = (queryDuration) => {
    setConText({
      queryDuration,
    });
  };

  return (
    <QueryExecutionContext.Provider
      value={{ state, retrieveHistory, setResult, deleteHistory, setStatus, setQueryDuration }}
    >
      {children}
    </QueryExecutionContext.Provider>
  );
};

export const QueryExecutionConsumer = QueryExecutionContext.Consumer;
