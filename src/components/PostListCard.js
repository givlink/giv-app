import utils from "lib/utils";
import { Link } from "@reach/router";
import { ChevronRightIcon } from "@heroicons/react/outline";

export default function PostListCard({ post }) {
  let firstImage;
  if (post.images) {
    firstImage = post.images[0];
  }

  return (
    <div className="mx-1.5 border border-gray-100 rounded-xl bg-white shadow">
      <Link to={`/users/${post.author.id}`}>
        <div className="flex items-center ml-2 py-3">
          <img
            src={utils.parseUrl(post.author.photoURL)}
            alt={post.author.name}
            className="h-14 w-14 object-cover border-2 border-gray-500 mr-2 rounded-full"
          />
          <h4 className="font-medium">{post.author.name}</h4>
        </div>
      </Link>
      <Link to={`/posts/${post.id}`}>
        {firstImage && (
          <img
            className="h-64 w-full object-cover overflow-hidden mb-2"
            src={utils.parseUrl(firstImage)}
            alt=""
          />
        )}
        <div className="px-2 py-2">
          <h3 className="font-medium text-xl mb-2">{post.title}</h3>
          <p className="">{utils.snipText(post.message)}</p>
        </div>
      </Link>
      <Link to={`/users/${post.giver.id}`}>
        <div className="flex items-center mx-3 mb-3 px-3 py-3 border border-gray-200 rounded-xl hover:shadow-xl">
          <img
            src={utils.parseUrl(post.giver.photoURL)}
            alt={post.giver.name}
            className="h-14 w-14 bject-cover border-2 border-gray-500 mr-2 rounded-full"
          />
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-giv-blue">
                  givを贈った人
                </span>
                <h4 className="font-medium">{post.giver.name}</h4>
              </div>
              <ChevronRightIcon className="h-6 w-6 text-gray-500" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
