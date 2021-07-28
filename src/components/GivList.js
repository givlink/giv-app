import React from "react";
import api from "lib/api";
import utils from "lib/utils";
import { Link } from "@reach/router";
import Spinner from "components/Spinner";
import SafeImage from "components/SafeImage";

const GivCard = ({ post, type = "receive" }) => {
  let firstImage;
  if (post.images && post.images.length) {
    firstImage = post.images[0];
  }

  const renderName = () => {
    let name = "";
    if (type === "receive") name = post.author.name;
    if (type === "send") name = post.giver.name;
    return utils.snipText(name, 15);
  };

  return (
    <Link
      to={`/posts/${post.id}`}
      className="flex flex-col items-center justify-center"
    >
      <SafeImage
        src={utils.parseUrl(firstImage)}
        alt=""
        className="h-32 w-full object-cover rounded-md shadow-lg"
        classNameFallback="w-32 h-32 opacity-25 object-fit rounded-md shadow"
      />
      <span className="block mt-1 text-sm">{renderName()}</span>
    </Link>
  );
};

const EmptyGivList = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <img
        className="w-12 h-12 animate-wobble-slow opacity-50"
        src="/icons/tama_def_sleepy.png"
        alt=""
      />
      <span className="text-xs text-gray-500 pt-2">No Givs Found</span>
    </div>
  );
};

const GivList = ({ userId, type = "receive" }) => {
  const [givs, setGivs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const run = async () => {
      //@Todo err handling
      let givs;
      if (type === "receive") {
        givs = await api.getUserReceivedPosts(userId);
      } else {
        givs = await api.getUserPosts(userId);
      }
      setGivs(givs);
      setLoading(false);
    };
    run();
  }, [userId, type]);

  if (loading) return <Spinner />;
  if (!givs.length) return <EmptyGivList />;

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-5">
      {givs.map((s) => (
        <li key={s.id} className="">
          <GivCard post={s} type={type} />
        </li>
      ))}
    </ul>
  );
};

export default GivList;
