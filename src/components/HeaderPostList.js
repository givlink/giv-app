import React from "react";
import { Switch } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import actions from "state/actions";

export default function Header() {
  const dispatch = useDispatch();
  const state = useSelector((s) => ({
    postAreaFilter: s.postAreaFilter,
    userLoading: s.userLoading,
    user: s.user,
  }));
  const handleChange = (enabled) => {
    const postAreaFilter = enabled ? "senboku" : null;
    dispatch(actions.switchAreaFilter(postAreaFilter));
  };
  const enabled = state.postAreaFilter === "senboku";

  const shouldShowFilter = state.user && state.user.area === "senboku";

  return (
    <div className="mb-16">
      <header className="z-10 border-b border-gray-200 bg-white px-3 py-2 shadow fixed w-full top-0">
        <div className="flex items-center justify-between">
          <img
            width="40"
            src="/image/giv_logo.png"
            alt="Giv"
            className="object-cover"
          />
          {!state.userLoading && shouldShowFilter && (
            <div className="flex flex-col items-end mt-2">
              <Switch
                checked={state.postAreaFilter}
                onChange={handleChange}
                className={`${enabled ? "bg-giv-blue" : "bg-gray-300"}
          relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${enabled ? "translate-x-4" : "translate-x-0"}
            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
              <span className="text-xs pt-px text-gray-500">
                {enabled ? " 泉北ニュータウン" : "全体"}
              </span>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
