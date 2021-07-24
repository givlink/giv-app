import "./index.css";

import { Router } from "@reach/router";

import UserList from "pages/UserList";
import UserDetail from "pages/UserDetail";

import PostList from "pages/PostList";
import PostDetail from "pages/PostDetail";
import PostEdit from "pages/PostEdit";

import Login from "pages/Login";
import Invite from "pages/Invite";

import Footer from "components/Footer";
import AuthProvider from "components/AuthProvider";
import InitProvider from "components/InitProvider";

const App = () => {
  return (
    <AuthProvider>
      <InitProvider>
        <Router className="h-screen w-screen" primary={false}>
          {/* Setup */}
          <Login path="login" />
          <Invite path="invite" />

          {/* Users */}
          <UserList path="users" />
          <UserDetail path="users/:id" />

          {/* Posts */}
          <PostDetail path="posts/:id" />
          <PostEdit path="posts/:id/edit" />
          <PostList path="/" />
        </Router>
        <Footer />
      </InitProvider>
    </AuthProvider>
  );
};
export default App;
