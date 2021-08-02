import { useLocation } from "@reach/router";
import { useSelector } from "react-redux";
import EditProfilePic from "components/EditProfilePic";
import SafeImage from "components/SafeImage";

const ProfilePic = (props) => {
  const loc = useLocation();
  const authUser = useSelector((s) => s.authUser);
  const isMyPage = loc.pathname === `/users/${authUser?.uid}`;
  return (
    <div>
      <SafeImage src={props.src} />
      {isMyPage && <EditProfilePic id={authUser?.uid} />}
    </div>
  );
};

export default ProfilePic;
