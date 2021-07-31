import HeaderChatList from "components/HeaderChatList";
import React from "react";
import { useSelector } from "react-redux";
import PostListCard from "components/PostListCard";
import Spinner from "components/Spinner";
import usePreserveScroll from "hooks/scroll";

const ChatComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <img
        className="w-24 h-24 animate-wobble-slow opacity-50"
        src="/icons/tama_def_sleepy.png"
        alt=""
      />
      <span className="text-sm text-gray-500 pt-2">
        Chat Feature Coming Soon
      </span>
    </div>
  );
};

export default function ChatList() {
  const state = useSelector((s) => ({
    chats: s.chats,
    chatsUnreadCount: s.chatsUnreadCount,
    loading: s.chatsLoading,
  }));
  usePreserveScroll("chatList");

  return (
    <div className="pb-20">
      <HeaderChatList active="chats" />
      {state.loading && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}

      <ChatComingSoon />

      <ul className="space-y-2">
        {state.chats.map((p) => {
          return (
            <li key={p.id}>
              <PostListCard post={p} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
