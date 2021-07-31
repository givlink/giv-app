import utils from "lib/utils";
import React from "react";
import { Link } from "@reach/router";
import SafeImage from "components/SafeImage";
import { CalendarIcon } from "@heroicons/react/outline";
import api from "lib/api";

const GivRequest = ({ notification, markRead }) => {
  const { requestType, sender, receiver } = notification;

  let requester;
  if (requestType === "send") {
    requester = sender;
  }
  if (requestType === "receive") {
    requester = receiver;
  }

  const msg = `New Giv Request from ${requester.name}`;

  return (
    <Link
      onClick={() => markRead(notification.id)}
      to={`/chats/requests`}
      className="flex space-x-3 pt-2 pb-3 px-3"
    >
      <SafeImage
        src={utils.parseUrl(requester.photoURL)}
        alt="Sender"
        className="h-12 w-12 object-cover border-2 border-gray-500 rounded-full"
        classNameFallback="w-12 object-cover rounded-full"
      />
      <div className="flex flex-col pt-1">
        <span className="text-sm pb-3">{msg}</span>
        <span className="block flex justify-end items-center text-gray-500 text-xs py-1">
          <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
          {utils.parseDate(notification.createdAt)}
        </span>
      </div>
    </Link>
  );
};
const GivFinished = ({ notification, markRead }) => {
  if (!notification || !notification.giv) return null;
  const { giv } = notification;
  // onClick={()=>markRead(notification.id)}
  return (
    <div className="flex space-x-3 pt-2 pb-3 px-3">
      <SafeImage
        src={utils.parseUrl(giv.giver?.photoURL)}
        alt="Giver"
        className="h-12 w-12 object-cover border-2 border-gray-500 rounded-full"
        classNameFallback="h-12 opacity-50 object-cover rounded-full"
      />
      <div className="flex flex-col pt-1">
        <span className="text-sm pb-3">
          {`You got a Giv from ${
            giv.giver ? giv.giver.name : "someone"
          }. Let's write a Thanks card.`}
        </span>
        <span className="block flex justify-end items-center text-gray-500 text-xs py-1">
          <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
          {utils.parseDate(notification.createdAt)}
        </span>
      </div>
    </div>
  );
};
const CommentCard = ({ notification, markRead }) => {
  const { comment } = notification;

  return (
    <Link
      onClick={() => markRead(notification.id)}
      to={`/posts/${notification.postId}`}
      className="flex space-x-3 pt-2 pb-3 px-3"
    >
      <SafeImage
        src={utils.parseUrl(comment.author?.photoURL)}
        alt="Author"
        className="h-12 w-12 object-cover border-2 border-gray-500 rounded-full"
        classNameFallback="w-12 object-cover rounded-full"
      />
      <div className="flex flex-col pt-1">
        <span className="text-sm pb-3">
          {`${
            comment.author ? comment.author.name : "Someone"
          } wrote a new comment on your post`}
        </span>
        <span className="block flex justify-end items-center text-gray-500 text-xs py-1">
          <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
          {utils.parseDate(notification.createdAt)}
        </span>
      </div>
    </Link>
  );
};

export default function NotificationCard({ user, notification }) {
  const markRead = (notId) => {
    //@Todo err
    api.updateNotification({ userId: user.uid, id: notId, status: "read" });
  };
  return (
    <div className="border-b border-gray-300 mx-1.5 bg-white">
      {notification.type === "commentCreated" && (
        <CommentCard notification={notification} markRead={markRead} />
      )}
      {notification.type === "givFinished" && (
        <GivFinished notification={notification} markRead={markRead} />
      )}
      {notification.type === "givRequest" && (
        <GivRequest notification={notification} markRead={markRead} />
      )}
    </div>
  );
}
