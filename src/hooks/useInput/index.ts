import { useCallback, useState } from 'react';

const useInput = <T>(defaultValue: T = undefined): [T, (e: any) => void] => {
  const [value, setValue] = useState(defaultValue);
  const searchValueChange = useCallback(e => {
    if (typeof e === 'string' || typeof e === 'number') {
      setValue(e as T);
    } else if (typeof e === 'object' && e.target && e.target.value) {
      setValue(e.target.value);
    } else {
      setValue(undefined);
    }
  }, []);

  return [value, searchValueChange];
};

export default useInput;
