import HeaderBack from "components/HeaderBack";
import React from "react";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import utils from "lib/utils";
import {
  CalendarIcon,
  ChevronRightIcon,
  ArrowCircleRightIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import { Link } from "@reach/router";
import api from "lib/api";
import usePreserveScroll from "hooks/scroll";

const CommentCard = ({ comment }) => {
  return (
    <div className="flex mx-3 py-3 border-b border-gray-200">
      <div className="w-16 mr-2">
        <img
          src={utils.parseUrl(comment.author.photoURL)}
          alt={comment.author.name}
          className="h-14 w-14 object-cover border-2 border-gray-500 mr-2 rounded-full"
        />
      </div>
      <div className="flex-1">
        <span className="font-medium text-lg">{comment.author.name}</span>
        <p className="pr-2">{comment.message}</p>
        <span className="block text-gray-500 text-sm text-right">
          {utils.parseDate(comment.createdAt)}
        </span>
      </div>
    </div>
  );
};
const CreateComment = ({ postId }) => {
  const authUser = useSelector((s) => s.authUser);
  const [user, setUser] = React.useState(null);
  const [comment, setComment] = React.useState("");

  //@Todo this should be done in store
  React.useEffect(() => {
    if (!authUser) return;
    api.getUserProfile(authUser.uid).then((u) => setUser(u));
  }, [authUser]);

  const handleChange = (e) => {
    resizeTextarea(e);
    setComment(e.target.value);
  };

  const resizeTextarea = (e) => {
    let area = e.target;
    area.style.height = "auto";
    area.style.height = area.scrollHeight + "px";
  };

  const commentValid = comment && comment !== "";

  if (!user) return null;

  return (
    <div className="px-3 py-3 flex border-b border-gray-200">
      <img
        src={utils.parseUrl(user.photoURL)}
        alt={user.displayName}
        className="h-14 w-14 object-cover border-2 border-gray-500 mr-2 rounded-full"
      />
      <div className="flex-1">
        <textarea
          onChange={handleChange}
          placeholder="Your Comment"
          style={{ maxHeight: "200px" }}
          className="resize-none w-full border border-gray-300 rounded"
        />
        <div className="flex justify-end">
          {commentValid && (
            <button
              disabled={!commentValid}
              className={`transition duration-150 flex items-center justify-center rounded-full h-12 w-12 ${
                commentValid
                  ? "bg-giv-blue text-white"
                  : "bg-gray-100 text-gray-300"
              }`}
            >
              <ArrowCircleRightIcon className="h-8 w-8" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentList = ({ postId }) => {
  //@Todo move fetching to store
  const [comments, setComments] = React.useState([]);

  React.useEffect(() => {
    if (!postId) return;
    //@todo err handling
    api.listComments(postId).then(([c]) => setComments(c));
  }, [postId]);

  return (
    <div>
      <h4 className="border-b border-gray-300 font-medium text-xl py-2 px-4">
        Comments
      </h4>
      <CreateComment />
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <CommentCard comment={c} />
          </li>
        ))}
      </ul>
    </div>
  );
};

//@Todo carousel Thumbs have some warning

export default function PostDetail(props) {
  const post = useSelector((s) => s.postById[props.id]);

  usePreserveScroll("postDetail");
  if (!post) return null;
  return (
      <div>
        <HeaderBack />
        <div className="bg-white pb-6">
          <Link to={`/users/${post.author.id}`}>
            <div className="flex items-center ml-4 py-5">
              <img
                src={utils.parseUrl(post.author.photoURL)}
                alt={post.author.name}
                className="h-20 w-20 object-cover border-2 border-gray-500 mr-2 rounded-full"
              />
              <h4 className="font-medium text-lg">{post.author.name}</h4>
            </div>
          </Link>
          {post.images && (
            <Carousel
              showStatus={false}
              showThumbs={true}
              autoPlay={false}
              swipeScrollTolerance={20}
            >
              {post.images.map((i) => (
                <img key={i} src={utils.parseUrl(i)} alt={post.title} />
              ))}
            </Carousel>
          )}
          <div className="px-4 pt-1 pb-4">
            <h3 className="font-medium text-2xl mb-2">{post.title}</h3>
            <p className="px-1 text-lg">{post.message}</p>
          </div>
          <div className="px-4 py-2 pb-8 flex items-center justify-between">
            <button className="text-red-500 flex items-center border border-red-400 rounded-md pl-3 pr-4 py-1">
              <HeartIcon className="h-7 w-7 mr-2 text-red-400" />
              Like
            </button>
            <span className="flex items-center rounded-md pl-3 pr-4 py-1">
              <CalendarIcon className="h-6 w-6 mr-1.5 text-gray-400" />
              {utils.parseDate(post.createdAt)}
            </span>
          </div>
          <Link to={`/users/${post.giver.id}`}>
            <div className="flex items-center mx-3 mb-3 px-3 py-3 border border-gray-200 rounded-xl hover:shadow-xl">
              <img
                src={utils.parseUrl(post.giver.photoURL)}
                alt={post.giver.name}
                className="h-24 w-24 object-cover shadow mr-4 rounded-full"
              />
              <div className="w-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-giv-blue">
                      givを贈った人
                    </span>
                    <h4 className="font-medium text-lg">{post.giver.name}</h4>
                  </div>
                  <ChevronRightIcon className="h-6 w-6 text-gray-500" />
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="pb-20 bg-white">
          <CommentList postId={props.id} />
        </div>
      </div>
  );
}
