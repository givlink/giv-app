import React from "react";
import { Link } from "@reach/router";

export default function Header({ active = "chats", count = 0 }) {
  return (
    <header className="z-10 border-b border-gray-200 bg-white px-3 shadow mb-3 sticky top-0">
      <div className="flex items-center mt-1.5 justify-between">
        <img
          src="/image/giv_logo.png"
          alt="Giv"
          className="w-10 object-cover"
        />
        <div className="flex-1 flex items-center ml-5 mr-3">
          <Link
            className={`${
              active === "chats"
                ? "border-giv-blue-dark text-giv-blue-dark"
                : "border-transparent text-gray-500"
            } -mb-px text-sm font-medium border-b-2 px-2 pt-5 pb-3 w-1/2 text-center inline-block`}
            to="/chats"
          >
            <span className="relative">
              Chats
              <span
                className={`${
                  active === "chats" && count > 0 ? "visible" : "hidden"
                } absolute top-0 right-0 -mr-6 -mt-3 p-1 leading-0 text-xs text-white bg-giv-blue rounded-full`}
              >
                {count}
              </span>
            </span>
          </Link>
          <Link
            className={`${
              active === "requests"
                ? "border-giv-blue-dark text-giv-blue-dark"
                : "border-transparent text-gray-500"
            } -mb-px text-sm font-medium border-b-2 px-2 pt-5 pb-3 w-1/2 text-center inline-block`}
            to="/chats/requests"
          >
            <span className="relative">
              Requests
              <span
                className={`${
                  active === "requests" && count > 0 ? "visible" : "hidden"
                } absolute top-0 right-0 -mr-7 -mt-3 w-6 h-6 p-1 flex items-center justify-center leading-0 text-xs text-white bg-giv-blue rounded-full`}
              >
                {count > 10 ? "9+" : count}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
