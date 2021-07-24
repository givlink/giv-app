import React from 'react'
import './index.css'

import { Router, useLocation, navigate } from '@reach/router'
import { useAuth, useInitAuth } from 'hooks/auth'
import init from 'hooks/init'

import UserList from 'pages/UserList'
import UserDetail from 'pages/UserDetail'
import UserEdit from 'pages/UserEdit'

import PostList from 'pages/PostList'
import PostDetail from 'pages/PostDetail'
import PostEdit from 'pages/PostEdit'

import Login from 'pages/Login'
import Invite from 'pages/Invite'

import SpinnerFull from 'components/SpinnerFull'
import Footer from 'components/Footer'

const AuthProvider = (props) => {
  useInitAuth()
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <SpinnerFull />

  if (!user && loc.pathname !== '/login') navigate('/login')

  return props.children
}

const App = () => {
  init.useInitPosts()
  init.useInitUsers()
  init.useInitSkills()
  init.useInitAreas()
  init.useInitSkillCategories()
  init.useInitAreaCategories()

  return (
    <AuthProvider>
      <Router className="h-screen w-screen" primary={false}>
        {/* Setup */}
        <Login path="login" />
        <Invite path="invite" />

        {/* Users */}
        <UserList path="users" />
        <UserDetail path="users/:id" />
        <UserEdit path="users/:id/edit" />

        {/* Posts */}
        <PostDetail path="posts/:id" />
        <PostEdit path="posts/:id/edit" />
        <PostList path="/" />
      </Router>
      <Footer />
    </AuthProvider>
  )
}
export default App
