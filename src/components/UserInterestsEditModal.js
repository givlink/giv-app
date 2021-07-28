import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";
import SkillSelector from "components/SkillSelector";
import Spinner from "components/Spinner";
import api from "lib/api";

const didChangeSkills = (oldSkills, newSkills) => {
  const before = JSON.stringify(oldSkills);
  const after = JSON.stringify(newSkills);
  return before !== after;
};

const UserInterestsEditModal = ({ id, editing, setEditing, userSkills = {} }) => {
  const [selectedSkills, setSelectedSkills] = React.useState(userSkills);
  const [sending, setSending] = React.useState(false);

  const ref = React.useRef();
  const dispatch = useDispatch();
  const state = useSelector((s) => ({
    user: s.userById[id],
    form: s.userEditForm,
    skillMap: s.skills,
    skillCategories: s.skillCategories,
  }));

  const closeModal = () => {
    if (sending) return;
    setEditing(false);
    dispatch({ type: "edit_user/reset" });
  };
  const onSkillClick = (id, selected) => {
    const newSkills = { ...selectedSkills };
    if (selected) {
      newSkills[id] = selected;
    } else {
      //remove false keys for easy comparison
      delete newSkills[id];
    }
    setSelectedSkills(newSkills);
  };

  const didChange = didChangeSkills(userSkills, selectedSkills);
  const onSave = async () => {
    setSending(true);
    //@todo err handling
    await api.updateCurrentUser({ interests: Object.keys(selectedSkills) });
    const user = await api.getUserProfile(id, false);
    dispatch({ type: "edit_user/new_data", user });
    setSending(false);
    closeModal();
  };

  return (
    <Transition.Root show={editing} as={React.Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={ref}
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
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
              className="bg-white overflow-hidden rounded-lg w-full pt-3 pb-4 text-left shadow-xl transform transition-all"
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
                      Edit Your Interests
                    </Dialog.Title>
                  </div>
                  <div className="flex-1 flex flex-col mt-5 pb-12 px-3 text-center overflow-auto">
                    <SkillSelector
                      allSkills={state.skillMap}
                      skillCategories={state.skillCategories}
                      userSkills={selectedSkills}
                      handleClick={onSkillClick}
                    />
                  </div>
                  <div className="fixed bottom-0 w-full border-t border-gray-200 bg-gray-100 px-4 py-3">
                    <button
                      onClick={onSave}
                      disabled={!didChange}
                      className={`w-full px-5 py-2 font-medium rounded ${
                        didChange ? "bg-giv-blue text-white shadow-xl" : "bg-gray-200 text-gray-600"
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
export default UserInterestsEditModal;
