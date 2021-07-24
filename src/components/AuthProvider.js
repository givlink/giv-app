import { useLocation, navigate } from "@reach/router";
import { useAuth, useInitAuth } from "hooks/auth";
import SpinnerFull from "components/SpinnerFull";

const AuthProvider = (props) => {
  useInitAuth();
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <SpinnerFull />;

  if (!user && loc.pathname !== "/login") navigate("/login");

  return props.children;
};

export default AuthProvider;
