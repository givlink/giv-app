import { useDispatch } from "react-redux";
import React from "react";
import { PencilIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import Spinner from "components/Spinner";
import api from "lib/api";
// import { toast } from "react-hot-toast";

const EditModal = ({
  initialName = "",
  initialJob = "",
  id,
  editing,
  setEditing,
}) => {
  const ref = React.useRef();
  const [name, setName] = React.useState(initialName);
  const [job, setJob] = React.useState(initialJob);

  const [sending, setSending] = React.useState(false);

  const dispatch = useDispatch();

  const closeModal = () => {
    if (sending) return;
    setEditing(false);
  };
  const onChange = (e) => {
    if (e.target.name === "name") setName(e.target.value);
    if (e.target.name === "job") setJob(e.target.value);
  };
  const onSave = async () => {
    setSending(true);
    await api.updateCurrentUser({ name, job });
    //@todo err handling
    const user = await api.getUserProfile(id, false);
    dispatch({ type: "edit_user/new_data", user });
    setSending(false);
    closeModal();
  };
  const didChange = name !== initialName || job !== initialJob;

  return (
    <Transition.Root show={editing} as={React.Fragment}>
      <Dialog
        as="div"
        initialFocus={ref}
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={editing}
        onClose={closeModal}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              style={{ minHeight: "40vh" }}
              className="bg-white rounded-lg overflow-hidden w-full pt-3 pb-4 text-left shadow-xl transform transition-all"
            >
              {sending ? (
                <button className="flex items-center justify-center h-full w-full">
                  <Spinner />
                </button>
              ) : (
                <div className="flex flex-col overflow-hidden h-full">
                  <div className="flex items-center mx-2">
                    <button
                      type="button"
                      className="shadow-lg inline-flex justify-center rounded-full border border-transparent shadow-sm p-1 bg-gray-300 text-base font-medium text-gray-500 hover:bg-gray-400 focus:outline-none"
                      onClick={closeModal}
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <Dialog.Title
                      as="h3"
                      className="flex-1 text-center mr-4 text-base leading-6 font-medium text-gray-900"
                    >
                      Edit Profile
                    </Dialog.Title>
                  </div>
                  <div className="flex-1 flex flex-col mt-5 pb-20 px-3 text-center overflow-auto">
                    <label className="flex flex-col items-start px-2">
                      <span className="text-sm text-gray-800 font-medium">
                        Name
                      </span>
                      <input
                        value={name}
                        name="name"
                        onChange={onChange}
                        placeholder="Your Name"
                        className="mt-1 w-full border border-gray-300 px-3 py-2 rounded"
                      />
                    </label>
                    <label className="mt-6 flex flex-col items-start px-2">
                      <span className="text-sm text-gray-800 font-medium">
                        Job
                      </span>
                      <input
                        name="job"
                        value={job}
                        placeholder="Your Job"
                        onChange={onChange}
                        className="mt-1 w-full border border-gray-300 px-3 py-2 rounded"
                      />
                    </label>
                  </div>
                  <div className="fixed bottom-0 w-full border-t border-gray-200 bg-gray-100 px-4 py-3">
                    <button
                      onClick={onSave}
                      disabled={!didChange}
                      className={`w-full px-5 py-2 font-medium rounded ${
                        didChange
                          ? "bg-giv-blue text-white shadow-xl"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default function EditUser({ id, user }) {
  const [editing, setEditing] = React.useState(false);

  return (
    <div className="flex justify-end">
      <button
        onClick={() => setEditing(true)}
        // onClick={debug}
        className="flex items-center underline rounded px-4 py-1.5 text-sm font-medium leading-none"
      >
        <PencilIcon className="h-4 w-4 mr-1" />
        Edit Profile
      </button>
      <EditModal
        initialName={user.name}
        initialJob={user.job}
        editing={editing}
        setEditing={setEditing}
        id={id}
      />
    </div>
  );
}
