import React, { useState, useEffect } from "react";

export default function useDebounce(value, delay) {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setVal(value), delay);

    return () => clearTimeout(handler);
  }, [value]);

  return val;
}
