import HeaderNotificationList from "components/HeaderNotificationList";
import React from "react";
import { useSelector } from "react-redux";
import NotificationListCard from "components/NotificationListCard";
import Spinner from "components/Spinner";
import usePreserveScroll from "hooks/scroll";

export default function NotificationList() {
  const state = useSelector((s) => ({
    authUser: s.authUser,
    notifications: s.notifications,
    loading: s.notificationsLoading,
  }));

  usePreserveScroll("notificationList", true);

  return (
    <div className="pb-20 h-full">
      <HeaderNotificationList />
      {state.loading && <Spinner />}

      <ul className="pb-20">
        {state.notifications.map((n) => {
          return (
            <li key={n.id}>
              <NotificationListCard user={state.authUser} notification={n} />
            </li>
          );
        })}

        {state.notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-4">
            <img
              className="w-16 h-16 animate-wobble-slow"
              src="/icons/tama_def_sleepy.png"
              alt=""
            />
            <span className="text-sm text-gray-500 pt-2">
              No new notifications
            </span>
          </div>
        )}
      </ul>
    </div>
  );
}
