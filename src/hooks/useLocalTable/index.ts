import { useEffect, useMemo, useCallback, useRef } from 'react';
import useSetState from '../useSetState';
import useSelectRows from '../useSelectRows';
import useInput from '../useInput';

const diffValue = (a: string, b: string, strictMatch: boolean = false) => {
  if (strictMatch) {
    return a === b;
  }
  return a.indexOf(b) > -1;
};

interface TableState<T extends object = {}> {
  data: {
    list: T[];
    pagination: {
      current: number;
      pageIndex: number;
      pageSize: number;
      total: number;
    };
  };
  selectedRowKeys: string[];
  selectedRows: T[];
  searchValue: string;
}

interface TableFn<T> {
  onPageChange: (pageIndex: number, pageSize: number) => any;
  onSelectRow: (selectedRows: T[]) => any;
  allCheckedChange: (selectedRowskeys: string[], selectedRows: T[]) => any;
}

interface TableSearch {
  Search: () => any;
  onChange: (val) => any;
}
function useLocalTable<T>(
  payload: {
    data: T[];
    pageSize?: number
    filterParams?: object;
    rowKey?: string;
    selectedRows?: T[];
    searchKey?: string[] | string;
  },
  option?: { strictMatch: boolean; MultiSelectKeys: boolean }
): [TableState, TableFn<T>, TableSearch];

function useLocalTable<T extends object>(payload, { strictMatch = false, MultiSelectKeys = false } = {}) {
  const { data = [], filterParams = {}, rowKey = 'id', searchKey, pageSize: defaultPageSize = 10 } = payload;
  const [state, setState] = useSetState({
    allData: data,
    pageIndex: 1,
    pageSize: defaultPageSize || 10,
    total: data.length,
  });

  const originAllDataRef = useRef<T[]>(data)

  const { selectedRowKeys, selectedRows, onSelectRow, allCheckedChange } = useSelectRows<T>(payload.selectedRows || [], rowKey);
  const [searchValue, onSearchValueChange] = useInput(undefined);

  useEffect(
    () => {
      if (JSON.stringify(data) !== JSON.stringify(originAllDataRef.current)) {
        setState({
          allData: data,
          total: data.length,
        });
        originAllDataRef.current = data
      }
    },
    [data]
  );

  const onSearch = () => {
    const filterKeys = Object.keys(filterParams);
    const allData = originAllDataRef.current
      .filter(item => {
        let flag = true;
        if (!searchValue) {
          return true;
        }
        if (Array.isArray(searchKey)) {
          flag = searchKey.some(key => {
            const value = item[key];
            return diffValue(value, searchValue, strictMatch);
          });
        } else if (typeof searchKey === 'string') {
          flag = diffValue(item[searchKey], searchValue, strictMatch);
        }
        return flag;
      })
      .filter(item => {
        let filterFlag = true;
        filterKeys.forEach(filterKey => {
          const filterValue = filterParams[filterKey];
          if (Array.isArray(filterValue)) {
            filterFlag = filterValue.length ? filterValue.includes(`${item[filterKey]}`) : true;
          } else {
            filterFlag = filterValue ? filterValue == item[filterKey] : true;
          }
        });
        return filterFlag;
      });
    setState({ allData, pageIndex: 1, total: allData.length });
  };

  const onPageChange = useCallback(
    (pageIndex, pageSize) => {
      setState({ pageIndex, pageSize });
      if (!MultiSelectKeys) {
        onSelectRow([]);
      }
    },
    [MultiSelectKeys]
  );

  const _state = useMemo(
    () => {
      const pagination = {
        current: state.pageIndex,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        total: state.total,
      };

      const idx = (state.pageIndex - 1) * state.pageSize;
      const list = state.allData.slice(idx, idx + state.pageSize);
      // 最后页兼容 如果为0自动退一页 且pageIndex>1
      if (list.length === 0 && state.pageIndex > 1) {
        onPageChange(state.pageIndex - 1, state.pageSize);
      }
      return {
        data: {
          list,
          pagination,
        },
        selectedRowKeys,
        selectedRows,
        searchValue,
      };
    },
    [state.pageIndex, state.allData, state.pageSize, selectedRowKeys, selectedRows, searchValue]
  );

  return [_state, { onPageChange, onSelectRow, allCheckedChange }, { Search: onSearch, onChange: onSearchValueChange }];
}

export default useLocalTable;
