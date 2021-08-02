import React from "react";
import { useSelector, useDispatch } from "react-redux";

const DISABLE_IN_DEV = false && process.env.NODE_ENV === "development";

const usePreserveScroll = (page, alwaysTop = false) => {
  const dispatch = useDispatch();
  const pos = useSelector((s) => s[`${page}ScrollPos`] || 0);
  React.useLayoutEffect(() => {
    let newPos = pos || 0;
    if (alwaysTop && !DISABLE_IN_DEV) newPos = 0;

    window.scrollTo(0, newPos);

    return () => {
      if (pos !== window.scrollY) {
        dispatch({ type: "nav/scroll", page, pos: window.scrollY });
      }
    };
  }, [page, pos, dispatch, alwaysTop]);

  return null;
};

export default usePreserveScroll;
