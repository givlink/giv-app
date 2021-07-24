import React from "react";
import { useSelector, useDispatch } from "react-redux";

const ScrollProvider = ({ page, children }) => {
  const dispatch = useDispatch();
  const pos = useSelector((s) => s[`${page}ScrollPos`] || 0);

  React.useEffect(() => {
    let newPos = pos;
    if (!page) {
      newPos = 0;
    }
    window.scrollTo(0, newPos);
  }, [pos, page]);

  React.useEffect(() => {
    if (!page) return;

    const handleScroll = (e) => {
      dispatch({ type: "nav/scroll", page, pos: window.scrollY });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, dispatch]);

  return <div className="h-screen w-screen">{children}</div>;
};

export default ScrollProvider;
