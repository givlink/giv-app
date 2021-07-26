import React from "react";
import { useSelector, useDispatch } from "react-redux";

const usePreserveScroll = (page, alwaysTop = false) => {
  const dispatch = useDispatch();
  const pos = useSelector((s) => s[`${page}ScrollPos`] || 0);
  React.useLayoutEffect(() => {
    let newPos = pos || 0;
    if (alwaysTop) newPos = 0;

    window.scrollTo(0, newPos);

    return () => {
      dispatch({ type: "nav/scroll", page, pos: window.scrollY });
    };
  }, [page, pos, dispatch, alwaysTop]);

  return null;
};

export default usePreserveScroll;
