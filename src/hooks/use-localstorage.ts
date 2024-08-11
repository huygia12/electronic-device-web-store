import { Nullable } from "@/utils/declare";
import { useState } from "react";

const useLocalStorage = <T>(
  key: string
): [Nullable<T>, (value: Nullable<T>) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<Nullable<T>>(() => {
    const prevValue: Nullable<string> = window.localStorage.getItem(key);

    return prevValue && JSON.parse(prevValue);
  });

  const setToLocal = (value: Nullable<T>) => {
    window.localStorage.setItem(key, JSON.stringify(value));
    setStoredValue(value);
  };

  const removeFromLocal = () => {
    window.localStorage.removeItem(key);
    setStoredValue(null);
  };

  return [storedValue, setToLocal, removeFromLocal];
};

export default useLocalStorage;
