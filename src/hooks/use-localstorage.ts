import { useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initValue: T
): [T, (value: T) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const prevValue = window.localStorage.getItem(key);
      return prevValue ? JSON.parse(prevValue) : initValue;
    } catch {
      console.debug(`Storage value for key: ${key} is null`);
      return initValue;
    }
  });

  const setToLocal = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.debug(`Storage value for key: ${key} is null`);
    }
  };

  const removeFromLocal = () => {
    try {
      setStoredValue(initValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.debug(`Storage value for key: ${key} is null`);
    }
  };

  return [storedValue, setToLocal, removeFromLocal];
};

export default useLocalStorage;
