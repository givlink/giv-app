import { useLocation, navigate } from "@reach/router";
import { useAuth, useInitAuth } from "hooks/auth";
import SpinnerFull from "components/SpinnerFull";

const AuthProvider = (props) => {
  useInitAuth();
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <SpinnerFull />;

  const validNoAuthPaths = ["/login", "/invite"];

  if (!user && !validNoAuthPaths.includes(loc.pathname)) navigate("/login");

  return props.children;
};

export default AuthProvider;
