import { SearchIcon } from "@heroicons/react/outline";

export default function Header() {
  return (
    <header className="z-10 border-b border-gray-200 bg-white px-3 py-2 shadow mb-3 sticky top-0">
      <div className="flex items-center justify-between">
        <img width="40" src="/image/giv_logo.png" alt="Giv" className="object-cover" />
        <div className="relative ml-2 flex-1 flex justify-end mt-1">
              <SearchIcon className="absolute left-0 mt-2.5 ml-3 h-5 w-5 text-gray-500" />
          <input placeholder="Search users" className="border border-gray-300 text-sm pl-9 pr-3 py-2 rounded-full w-full focus:outline-none" />
        </div>
      </div>
    </header>
  );
}
