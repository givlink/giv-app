import React from "react";
import { Link } from "@reach/router";
import { HomeIcon } from "@heroicons/react/outline";
import ErrorComponent from "components/Error";
import SpinnerFull from "components/SpinnerFull";
import { useSelector } from "react-redux";
import api from "lib/api";

const Page6 = ({ data }) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const authUser = useSelector((s) => s.authUser);

  React.useEffect(() => {
    if (!authUser) return;
    if (!data) return;

    const run = async () => {
      try {
        await api.createUserProfile({
          uid: authUser.uid,
          ...data,
        });
        setLoading(false);
      } catch (err) {
        setError("エラー：" + err.message);
        setLoading(false);
      }
    };
    run();
  }, [authUser, data]);

  if (loading) return <SpinnerFull />;
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full px-2 overflow-x-hidden bg-blue-50">
      <div className="flex-1" />
      <div className="px-12 flex flex-col items-center justify-center w-full mb-12">
        <img className="w-24 h-24 mb-12" src="/image/giv_logo.png" alt="" />
        {error ? (
          <>
            <ErrorComponent error={error} />
            <span className="mt-6 text-sm">
              Please contact Giv support team
            </span>
          </>
        ) : (
          <>
            <span className="text-xl text-blue-900">Registration Finished</span>
            <span className="text-xl text-blue-900">Thank You</span>
          </>
        )}
      </div>
      <div className="flex-1" />
      {!error && (
        <Link
          to="/"
          replace={true}
          className="mb-6 w-4/5 text-white font-medium bg-giv-blue px-8 py-4 rounded flex items-center justify-center"
        >
          <HomeIcon className="mr-2 h-6 w-6" />
          Go to Home
        </Link>
      )}
    </div>
  );
};

export default Page6;
