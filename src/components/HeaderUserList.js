import React from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/outline";
import { useSelector, useDispatch } from "react-redux";
import actions from "state/actions";

export default function Header() {
  const state = useSelector((s) => ({
    skillCategories: s.skillCategories,
    skillMap: s.skills,
    userSearchFilter: s.userSearchFilter,
    usersLoading: s.usersLoading,
  }));
  const [value, setValue] = React.useState("");

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (state.userSearchFilter.type === "name") {
      setValue(state.userSearchFilter.value);
    } else {
      setValue("");
    }
  }, [state.userSearchFilter]);

  const handleSubmit = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    dispatch(
      actions.updateSearchFilter({
        type: value === "" ? null : "name",
        value: value === "" ? null : value,
      })
    );
  };
  const handleChange = (e) => setValue(e.target.value);
  const handleReset = () => {
    setValue("");
    dispatch(actions.updateSearchFilter({ type: null, value: null }));
  };

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
          <div className="relative ml-2 flex-1 flex justify-end mt-1">
            <SearchIcon className="absolute left-0 mt-2.5 ml-3 h-5 w-5 text-gray-500" />
            <input
              disabled={state.usersLoading}
              value={value}
              name="name"
              onChange={handleChange}
              onKeyDown={handleSubmit}
              placeholder="Search by last name"
              className="border border-gray-300 text-sm pl-9 pr-9 py-2 rounded-full w-full focus:outline-none"
            />
            {value !== "" && (
              <button
                onClick={handleReset}
                className="absolute right-0 mt-2.5 mr-3 h-5 w-5"
              >
                <XIcon className="h-5 w-5 text-red-500" />
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
