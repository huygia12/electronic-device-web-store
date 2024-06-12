import { useState } from "react";
import log from "loglevel";

log.setLevel("warn");

export function useLocalStorage<T>(
  key: string,
  initValue: T
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const prevValue = window.localStorage.getItem(key);
      return prevValue ? JSON.parse(prevValue) : initValue;
    } catch {
      log.info(`Storage value for key: ${key} is null`);
      return initValue;
    }
  });

  const setToLocal = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      log.info(`Storage value for key: ${key} is null`);
    }
  };

  const removeFromLocal = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      log.info(`Storage value for key: ${key} is null`);
    }
  };

  return [storedValue, setToLocal, removeFromLocal];
}
