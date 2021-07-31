import HeaderChatList from "components/HeaderChatList";
import React from "react";
import { useSelector } from "react-redux";
import RequestListCard from "components/RequestListCard";
import Spinner from "components/Spinner";
import usePreserveScroll from "hooks/scroll";

export default function RequestList() {
  const state = useSelector((s) => ({
    authUser: s.authUser,
    requests: s.requests,
    requestsPendingCount: s.requestsPendingCount,
    loading: s.requestsLoading,
  }));
  usePreserveScroll("requestList");

  return (
    <div className="pb-20">
      <HeaderChatList active="requests" count={state.requestsPendingCount} />
      {state.loading && (
        <div className="mb-8">
          <Spinner />
        </div>
      )}

      <ul className="">
        {state.requests.map((p) => {
          return (
            <li key={p.id}>
              <RequestListCard request={p} />
            </li>
          );
        })}

        {!state.loading && state.requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-4">
            <img
              className="w-16 h-16 animate-wobble-slow"
              src="/icons/tama_def_sleepy.png"
              alt=""
            />
            <span className="text-sm text-gray-500 pt-2">No new requests</span>
          </div>
        )}
      </ul>
    </div>
  );
}
