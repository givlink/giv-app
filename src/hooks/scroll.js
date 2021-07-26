import React from "react";
import { useSelector, useDispatch } from "react-redux";

const usePreserveScroll = (page) => {
  const dispatch = useDispatch();
  const pos = useSelector((s) => s[`${page}ScrollPos`] || 0);
  React.useLayoutEffect(() => {
    const newPos = pos || 0;

    window.scrollTo(0, newPos);

    if (!pos) {
      return;
    }

    return () => {
      dispatch({ type: "nav/scroll", page, pos: window.scrollY });
    };
  }, []);

  return null;
};

export default usePreserveScroll;
