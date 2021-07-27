import React from "react";
import { useAuth } from "hooks/auth";
import { useDispatch } from "react-redux";
import actions from "state/actions";

//Loads up all initial resources
const InitProvider = (props) => {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (loading || !user) return;

    dispatch(actions.loadUserProfileAndInitialPost());
    dispatch(actions.loadInitialUsers());
    dispatch(actions.loadInitialSkills());
    dispatch(actions.loadInitialAreas());
    dispatch(actions.loadInitialSkillCategories());
    dispatch(actions.loadInitialAreaCategories());
  }, [dispatch, user, loading]);

  return props.children;
};

export default InitProvider;
