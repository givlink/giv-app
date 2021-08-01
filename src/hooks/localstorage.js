import React from "react";

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      let item;
      if (typeof window !== "undefined") {
        item = window.localStorage.getItem(key);
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log("Error Localstorage", error.message);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      //@Todo handle error
    }
  };

  return [storedValue, setValue];
}
