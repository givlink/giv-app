import { LogoutIcon } from "@heroicons/react/outline";
import actions from "state/actions";
import { useDispatch } from "react-redux";
export default function Header() {
  const dispatch = useDispatch();
  return (
    <header className="z-10 border-b border-gray-200 bg-white px-3 py-2 shadow mb-3 sticky top-0">
      <div className="flex items-center justify-between">
        <img
          width="40"
          src="/image/giv_logo.png"
          alt="Giv"
          className="object-cover"
        />
        <button
          onClick={() => dispatch(actions.logout())}
          className="text-gray-600 flex items-center text-xs pl-3 pr-1 py-2 font-medium hover:bg-gray-100 rounded"
        >
          Logout
          <LogoutIcon className="h-4 w-4 -mb-px ml-1 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
