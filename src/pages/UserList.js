import React from "react";
import HeaderUserList from "components/HeaderUserList";
import { useSelector, useDispatch } from "react-redux";
import UserListCard from "components/UserListCard";
import Spinner from "components/Spinner";
import actions from "state/actions";
import { ChevronRightIcon } from "@heroicons/react/outline";
import usePreserveScroll from "hooks/scroll";

const makeOptions = (map, type, category) => {
  const result = [];

  category.forEach((ac) => {
    const itemsInCategory = [];
    Object.values(map).forEach((i) => {
      if (i.category === ac.id) {
        itemsInCategory.push(i);
      }
    });
    const item = [ac, itemsInCategory];
    if (itemsInCategory.length) result.push(item);
  });
  return result;
};

const FilterBar = (props) => {
  const {
    selected,
    skillMap,
    areaMap,
    skillCategories,
    areaCategories,
  } = useSelector((s) => ({
    skillCategories: s.skillCategories,
    skillMap: s.skills,
    areaCategories: s.areaCategories,
    areaMap: s.areas,
    selected: s.selectedTag,
  }));
  const handleChange = (e) => {};
  return (
    <div className="flex items-center space-x-0.5 text-xs mx-1.5 mt-2 mb-6">
      <select
        value={selected}
        onChange={handleChange}
        className="w-1/2 border border-gray-200 rounded h-12 px-1 py-2"
      >
        <option value="" className="text-center">
          興味・関心フィルター
        </option>
        {makeOptions(skillMap, "skills", skillCategories).map(
          ([cat, skills]) => {
            return (
              <optgroup key={cat.id} label={cat.tag}>
                {skills.map((s) => (
                  <option key={s.id} className="block pl-1 py-1" value={s.id}>
                    {s.tag}
                  </option>
                ))}
              </optgroup>
            );
          }
        )}
      </select>
      <select
        value={selected}
        onChange={handleChange}
        className="w-1/2 border border-gray-200 rounded h-12 px-1 py-2"
      >
        <option value="" className="text-center">
          場所フィルター
        </option>

        {makeOptions(areaMap, "area", areaCategories).map(([cat, skills]) => {
          return (
            <optgroup key={cat.id} label={cat.tag}>
              {skills.map((s) => (
                <option key={s.id} className="block pl-1 py-1" value={s.id}>
                  {s.tag}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
};

export default function UserList() {
  const dispatch = useDispatch();
  const { users, loading, hasMore, loadingMore } = useSelector((s) => ({
    users: s.users,
    loading: s.usersLoading,
    hasMore: s.usersHasMore,
    loadingMore: s.usersLoadingMore,
  }));

  usePreserveScroll("userList");

  return (
    <div className="pb-24">
      <HeaderUserList />
      <FilterBar />
      {loading && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}

      <ul className="divide-y">
        {users.map((u) => {
          return (
            <li key={u.id}>
              <UserListCard user={u} />
            </li>
          );
        })}
      </ul>
      {hasMore && !loading && (
        <div className="flex items-center justify-center mx-2">
          <button
            disabled={loadingMore}
            className="flex items-center justify-end px-6 w-full border border-gray-400 shadow rounded py-3 my-3"
            onClick={() => dispatch(actions.loadMoreUsers())}
          >
            <span className="mr-2 mb-px">Load More</span>
            {loadingMore ? (
              <Spinner size="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
