import utils from "lib/utils";
import { Link } from "@reach/router";
import SafeImage from "components/SafeImage";
import { ChevronRightIcon } from "@heroicons/react/outline";

export default function PostListCard({ notification }) {
  return (
    <div className="mx-1.5 border border-gray-100 rounded-xl bg-white shadow">
      {notification.id}
      {notification.type}
    </div>
  );
}
