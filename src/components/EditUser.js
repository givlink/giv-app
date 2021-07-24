import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { PencilIcon, ChevronLeftIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import SkillSelector from "components/SkillSelector";
import Spinner from "components/Spinner";
import api from "lib/api";

const EditModal = ({ id, editing, setEditing }) => {
  const dispatch = useDispatch();
  const state = useSelector((s) => ({
    user: s.userById[id],
    form: s.userEditForm,
    skillMap: s.skills,
    userEditingChanged: s.userEditingChanged,
    userEditingLoading: s.userEditingLoading,
  }));

  const closeModal = () => {
    if (state.userEditingLoading) return;
    setEditing(false);
    dispatch({ type: "edit_user/reset" });
  };
  const updateUser = (e) => {
    dispatch({
      type: "edit_user/update_value",
      [e.target.name]: e.target.value,
    });
  };
  const onSkillClick = (id, selected) => {
    dispatch({ type: "edit_user/change_skill", id, selected });
  };
  const onSave = async () => {
    dispatch({ type: "edit_user/loading_start" });
    await new Promise((r) => setTimeout(r, 1000));
    //@todo err
    const user = await api.getUserProfile(id, false);
    dispatch({ type: "edit_user/new_data", user });
    //@Todo update store with new user data
    dispatch({ type: "edit_user/reset" });
  };

  React.useEffect(() => {
    dispatch({ type: "edit_user/reset" });
  }, [dispatch]);
  return (
    <Transition.Root show={editing} as={React.Fragment}>
      <Dialog
        as="div"
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
              style={{ height: "85vh", minWidth: "80vw" }}
              className="bg-white rounded-lg w-full pt-3 pb-4 text-left shadow-xl transform transition-all"
            >
              {state.userEditingLoading ? (
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
                  <div className="flex-1 flex flex-col mt-5 pb-12 px-3 text-center overflow-auto">
                    <label className="flex flex-col items-start">
                      <span className="text-sm text-gray-800 font-medium">
                        Name
                      </span>
                      <input
                        value={state.form.name}
                        name="name"
                        onChange={updateUser}
                        placeholder="Your Name"
                        className="mt-1 w-full border border-gray-300 px-3 py-2 rounded"
                      />
                    </label>
                    <label className="mt-6 flex flex-col items-start">
                      <span className="text-sm text-gray-800 font-medium">
                        Job
                      </span>
                      <input
                        name="job"
                        value={state.form.job}
                        placeholder="Your Job"
                        onChange={updateUser}
                        className="mt-1 w-full border border-gray-300 px-3 py-2 rounded"
                      />
                    </label>
                    <label className="mt-6 mb-6 flex-1 flex flex-col items-start">
                      <span className="text-sm text-gray-800 font-medium">
                        Intro
                      </span>
                      <textarea
                        rows="5"
                        name="intro"
                        value={state.form.intro}
                        onChange={updateUser}
                        placeholder="Your Intro"
                        className="resize-none mt-1 w-full border border-gray-300 px-3 py-2 rounded"
                      />
                    </label>
                    <div className="flex flex-col items-start pb-4">
                      <span className="font-medium text-gray-800 text-sm mb-1">
                        Your Interests
                      </span>
                      <SkillSelector
                        allSkills={state.skillMap}
                        userSkills={state.form.skills}
                        handleClick={onSkillClick}
                      />
                    </div>
                  </div>
                  <div className="fixed bottom-0 w-full border-t border-gray-200 bg-gray-100 px-4 py-3">
                    <button
                      onClick={onSave}
                      disabled={!state.userEditingChanged}
                      className={`w-full px-5 py-2 font-medium rounded ${
                        state.userEditingChanged
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

export default function EditUser({ id }) {
  const [editing, setEditing] = React.useState(false);

  return (
    <div className="flex justify-end mx-3">
      <button
        onClick={() => setEditing(true)}
        className="flex items-center border border-gray-400 rounded px-4 py-1.5 text-sm font-medium leading-none"
      >
        <PencilIcon className="h-4 w-4 mr-1" />
        Edit Profile
      </button>
      <EditModal editing={editing} setEditing={setEditing} id={id} />
    </div>
  );
}
