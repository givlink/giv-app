import HeaderNotificationList from "components/HeaderNotificationList";
import React from "react";
import { useSelector } from "react-redux";
import NotificationListCard from "components/NotificationListCard";
import Spinner from "components/Spinner";
import usePreserveScroll from "hooks/scroll";

export default function NotificationList() {
  const state = useSelector((s) => ({
    notifications: s.notifications,
    loading: s.notificationsLoading,
  }));

  usePreserveScroll("notificationList", true);

  return (
    <div className="pb-20">
      <HeaderNotificationList />
      {state.loading && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}

      <ul className="space-y-2">
        {state.notifications.map((n) => {
          return (
            <li key={n.id}>
              <NotificationListCard notification={n} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
