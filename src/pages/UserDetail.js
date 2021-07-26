import HeaderMyPage from "components/HeaderMyPage";
import HeaderBack from "components/HeaderBack";
import Spinner from "components/Spinner";
import React from "react";
import { useLocation } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
import utils from "lib/utils";
import api from "lib/api";
import SkillTagList from "components/SkillTagList";
import ProfilePic from "components/ProfilePic";
import GivList from "components/GivList";
import { LocationMarkerIcon, PencilIcon } from "@heroicons/react/outline";
import EditUser from "components/EditUser";
import usePreserveScroll from "hooks/scroll";

export default function UserDetail(props) {
  const dispatch = useDispatch();
  const loc = useLocation();
  const state = useSelector((s) => ({
    user: s.userById[props.id],
    authUser: s.authUser,
    userSingleLoading: s.userSingleLoading,
    areaMap: s.areas,
  }));
  const { user } = state;

  const renderArea = (s) => {
    const area = state.areaMap[s];
    if (!area) return s;
    return area.tag;
  };

  usePreserveScroll("userDetail", true);

  React.useEffect(() => {
    if (user) return;

    //Else call api and update user list
    const run = async () => {
      //@Todo err handling
      dispatch({ type: "users/data_single_loading" });
      const user = await api.getUserProfile(props.id);
      dispatch({ type: "users/data_single", user });
    };
    run();
  }, [dispatch, user, props.id]);

  const isMyPage = loc.pathname === `/users/${state.authUser?.uid}`;

  if (!user && !state.userSingleLoading) return null; //@todo show 404
  return (
    <div className="bg-white h-full">
      {isMyPage ? <HeaderMyPage /> : <HeaderBack />}
      <div className="pb-24">
        {!user && state.userSingleLoading ? (
          <div className="pt-24">
            <Spinner />
          </div>
        ) : (
          <>
            {isMyPage && <EditUser id={user.id} />}
            <div className="grid grid-cols-12 py-5 pl-4 pr-1">
              <div className="col-span-5 mr-3">
                <ProfilePic src={utils.parseUrl(user.photoURL)} />
              </div>
              <div className="col-span-7">
                <h4 className="font-medium text-xl">{user.name}</h4>
                <span className="text-gray-600 text-sm whitespace-wrap pr-2">{user.job}</span>
                <div className="mt-4 flex items-center">
                  <LocationMarkerIcon className="h-5 w-5 mr-1 text-gray-400" />
                  <span>{renderArea(user.area)}</span>
                </div>
                <div className="mt-4">
                  <SkillTagList skills={user.skills} size="medium" />
                </div>
              </div>
            </div>
            {user.intro && user.intro !== "" && (
              <>
                <span className="block mt-4 mb-1 py-2 pl-4 pr-1 font-medium border-b">About</span>
                <p className="whitespace-pre-wrap leading-7 px-4">{user.intro}</p>
              </>
            )}
            <span className="block mt-4 mb-1 px-4 py-2 border-b font-medium">Interests</span>
            <div className="pl-4 pr-1 pt-2">
              <SkillTagList
                skills={user.interests}
                size={user.interests.length > 20 ? "normal" : "large"}
                limit={100}
              />
            </div>
            <span className="block mt-4 mb-1 px-4 py-2 border-b font-medium">Skills</span>
            <div className="pl-4 pr-1 pt-2">
              <SkillTagList skills={user.skills} size="large" limit={100} />
            </div>
            <span className="block mt-4 mb-1 px-4 py-2 border-b font-medium">Giv Given</span>
            <div className="px-4 pt-2">
              <GivList userId={user.id} type="receive" />
            </div>
            <span className="block mt-4 mb-1 px-4 py-2 border-b font-medium">Giv Received</span>
            <div className="px-4 pt-2">
              <GivList userId={user.id} type="send" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
