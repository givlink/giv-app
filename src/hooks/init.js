import React from 'react'
import { useDispatch } from 'react-redux'
import actions from 'state/actions'

const init = {
  useInitPosts: () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
      dispatch(actions.loadInitialPosts())
    }, [dispatch])

    return null
  },

  useInitUsers: () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
      dispatch(actions.loadInitialUsers())
    }, [dispatch])

    return null
  },
  useInitSkills: () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
      dispatch(actions.loadInitialSkills())
    }, [dispatch])

    return null
  },
  useInitAreas: () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
      dispatch(actions.loadInitialAreas())
    }, [dispatch])

    return null
  },
  useInitSkillCategories: () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
      dispatch(actions.loadInitialSkillCategories())
    }, [dispatch])

    return null
  },
  useInitAreaCategories: () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
      dispatch(actions.loadInitialAreaCategories())
    }, [dispatch])

    return null
  },
}

export default init
