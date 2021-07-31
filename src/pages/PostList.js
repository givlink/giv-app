import HeaderPostList from "components/HeaderPostList";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PostListCard from "components/PostListCard";
import Spinner from "components/Spinner";
import actions from "state/actions";
import usePreserveScroll from "hooks/scroll";
import { ChevronRightIcon, ArrowDownIcon } from "@heroicons/react/outline";
import PullToRefresh from "react-simple-pull-to-refresh";

const PullDownHandle = () => {
  return (
    <div className="flex flex-col items-center justify-center pb-4">
      <ArrowDownIcon className="h-7 w-7 text-gray-600" />
      <span className="text-gray-700">Pull down to refresh</span>
    </div>
  );
};

export default function PostList() {
  const dispatch = useDispatch();
  const { posts, loading, hasMore, loadingMore } = useSelector((s) => ({
    posts: s.posts,
    loading: s.postsLoading,
    hasMore: s.postsHasMore,
    loadingMore: s.postsLoadingMore,
  }));

  usePreserveScroll("postList");

  const handleRefresh = () => {
    dispatch(actions.loadInitialPosts());
    return Promise.resolve();
  };

  return (
    <div className="pb-20">
      <HeaderPostList />
      {loading && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}

      <PullToRefresh
        onRefresh={handleRefresh}
        pullingContent={<PullDownHandle />}
        refreshingContent={<Spinner />}
      >
        <ul className="space-y-2">
          {posts.map((p) => {
            return (
              <li key={p.id}>
                <PostListCard post={p} />
              </li>
            );
          })}
        </ul>
      </PullToRefresh>
      {hasMore && !loading && (
        <div className="flex items-center justify-center mx-2">
          <button
            disabled={loadingMore}
            className="flex items-center justify-end px-6 w-full border border-gray-400 shadow rounded py-3 my-3"
            onClick={() => dispatch(actions.loadMorePosts())}
          >
            <span className="mr-2 mb-px">Load More</span>
            {loadingMore ? (
              <Spinner size="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}