import React from "react";
import useUpdateNotifier from "hooks/updateNotifier";
import { Transition } from "@headlessui/react";
import { RefreshIcon } from "@heroicons/react/outline";

const AppRefreshButton = ({ available, setAvailable }) => {
  const onOk = () => {
    setAvailable(false);
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <Transition.Root show={available} as={React.Fragment}>
      <div className="fixed top-0 left-0 right-0 w-full z-20">
        <Transition.Child
          enter="ease-out duration-150 transform"
          enterFrom="-translate-y-8"
          enterTo="translate-y-0"
          leave="ease-in duration-100 transform"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-8"
          className="flex flex-col items-center py-10"
        >
          <button
            type="button"
            className="text-xs bg-giv-blue shadow-xl text-white font-medium px-4 py-2 rounded-full flex items-center"
            onClick={onOk}
          >
            <Transition.Child
              enter="ease-out duration-300 transform"
              enterFrom="rotate-180"
              enterTo="rotate-0"
              leave="ease-in duration-100 transform"
              leaveFrom="rotate-0"
              leaveTo="rotate-180"
            >
              <RefreshIcon className="animate-spin-slow duration-1000 mr-1 h-5 w-5" />
            </Transition.Child>
            <Transition.Child
              enter="ease-out duration-150 transform"
              enterFrom="translate-y-4"
              enterTo="translate-y-0"
              leave="ease-in duration-100 transform"
              leaveFrom="translate-y-0"
              leaveTo="-translate-y-4"
              className="underline"
            >
              Update available. Click to update
            </Transition.Child>
          </button>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
};

export default function AppUpdateProvider({ children }) {
  const [available, setAvailable] = React.useState(false);

  const onUpdateAvailable = () => setAvailable(true);
  const showDebug = false;

  useUpdateNotifier({ disableInDev: true, onUpdateAvailable });

  return (
    <>
      <AppRefreshButton available={available} setAvailable={setAvailable} />

      {showDebug && (
        <button
          onClick={() => setAvailable(!available)}
          className="debug text-white px-6 py-2 mt-96"
        >
          DEbug
        </button>
      )}
      {children}
    </>
  );
}
