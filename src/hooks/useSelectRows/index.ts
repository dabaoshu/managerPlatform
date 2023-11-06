import { useCallback, useState, useMemo } from 'react';

function useSelectRows<T extends object>(defaultrows = [], rowKey?: string) {
  const [selectedRows, setRows] = useState<T[]>(defaultrows);
  const onSelectRow = useCallback((rows: T[]) => {
    setRows(rows);
  }, []);
  const allCheckedChange = useCallback((keys: string[] = [], rows: T[] = []) => {
    if (keys.length) {
      setRows(rows);
    } else {
      setRows(rows);
    }
  }, []);
  const selectedRowKeys: string[] = selectedRows.map(o => o[rowKey]);
  return { selectedRowKeys, selectedRows, onSelectRow, allCheckedChange };
}

export function useFlipSelectRows<T extends object>(defaultrows = [], rowKey: string, list: T[]) {
  const [selectedRows, setRows] = useState<T[]>(defaultrows);

  const SelectFn = useMemo(
    () => {
      const listKeys = list.map(o => o[rowKey]);
      const onSelectRow = newSelectedRows => {
        const oldSelectedRows = selectedRows;
        const unCurrentSelectedRows = oldSelectedRows.filter(i => !listKeys.includes(i[rowKey]));
        const currentSelectedRows = newSelectedRows.filter(i => listKeys.includes(i[rowKey]));
        const _selectedRows = [...currentSelectedRows, ...unCurrentSelectedRows];
        setRows(_selectedRows);
      };
      const allCheckedChange = (keys = []) => {
        const oldSelectedRows = selectedRows;
        const unCurrentSelectedRows = oldSelectedRows.filter(i => !listKeys.includes(i[rowKey]));
        const currentSelectedRows = list.filter(i => listKeys.includes(i[rowKey]));
        let _selectedRows = [];
        if (keys.length) {
          _selectedRows = [...currentSelectedRows, ...unCurrentSelectedRows];
        } else {
          _selectedRows = [...unCurrentSelectedRows];
        }
        setRows(_selectedRows);
      };

      const removeRow = rowId => {
        const _selectedRows = selectedRows.filter(row => row[rowKey] !== rowId);
        setRows(_selectedRows);
      };

      const increaseRow = row => {
        const _selectedRows = [...selectedRows, row];
        setRows(_selectedRows);
      };

      return {
        onSelectRow,
        allCheckedChange,
        removeRow,
        increaseRow,
        setRows,
      };
    },
    [list, rowKey, selectedRows]
  );

  const selectedRowKeys = selectedRows.map(i => i[rowKey]);
  return [{ selectedRowKeys, selectedRows }, SelectFn] as [
    { selectedRowKeys: string[]; selectedRows: T[] },
    {
      onSelectRow: (selectedRows: T[]) => void;
      allCheckedChange: (key: string[]) => void;
      removeRow: (rowId: string) => void;
      increaseRow: (row: T) => void;
      setRows: (row: T) => void;
    }
  ];
}
export default useSelectRows;
