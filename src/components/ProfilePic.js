import { useLocation } from "@reach/router";
import { useSelector } from "react-redux";
import EditProfilePic from "components/EditProfilePic";

const ProfilePic = (props) => {
  const loc = useLocation();
  const authUser = useSelector((s) => s.authUser);
  const isMyPage = loc.pathname === `/users/${authUser?.uid}`;
  return (
    <div>
      <img
        alt=""
        src={props.src}
        className="h-32 w-32 object-cover shadow-xl rounded-xl"
      />
      {isMyPage && <EditProfilePic id={authUser?.uid} />}
    </div>
  );
};

export default ProfilePic;
