import './index.css'

import { Router } from '@reach/router'
import React from 'react'

import RecomendationList from 'pages/RecommendationList.js'
import UserList from 'pages/UserList'
import UserDetail from 'pages/UserDetail'
import UserPosts from 'pages/UserPosts'

import NotificationList from 'pages/NotificationList'

import PostList from 'pages/PostList'
import PostDetail from 'pages/PostDetail'
import PostEdit from 'pages/PostEdit'

import ChatList from 'pages/ChatList'
import ChatDetail from 'pages/ChatDetail'
import RequestList from 'pages/RequestList'

import LoginLegacy from 'pages/LoginLegacy'
import Login from 'pages/Login'
import ResetPassword from 'pages/ResetPassword'
import Invite from 'pages/Invite'

import Footer from 'components/Footer'
import AppUpdateProvider from 'components/AppUpdateProvider'
import AuthProvider from 'components/AuthProvider'
import useGlobalFuncs from 'hooks/useGlobalFuncs'
import InitProvider from 'components/InitProvider'
import InitV2Provider from 'components/InitV2Provider'
import NavigationProvider from 'components/NavigationProvider'
import useSavePushToken from 'hooks/savePushToken'
import OfflineBanner from 'components/Offline'
import ErrorBoundary from 'components/ErrorBoundary'
import SocketProvider from 'components/SocketProvider'
import { Toaster } from 'react-hot-toast'

const App = () => {
  useSavePushToken()
  useGlobalFuncs()
  return (
    <ErrorBoundary>
      <AuthProvider>
        <InitProvider>
          <InitV2Provider>
            <SocketProvider>
              <AppUpdateProvider>
                <NavigationProvider>
                  <Toaster />
                  <OfflineBanner />

                  <Router className='h-screen w-screen' primary={false}>
                    {/* Setup */}
                    <LoginLegacy path='login-legacy' />
                    <Login path='login' />
                    <ResetPassword path='reset' />
                    <Invite path='invite' />

                    <RecomendationList path='recommendations' />
                    {/* Users */}
                    <UserList path='users' />
                    <UserDetail path='users/:id' />
                    <UserPosts path='users/:id/posts' />

                    {/* Posts */}
                    <PostDetail path='posts/:id' />
                    <PostEdit path='posts/:id/edit' />
                    <PostList path='/' />

                    {/* Chats and Requests */}
                    <RequestList path='chats/requests' />
                    <ChatList path='chats' />
                    <ChatDetail path='chats/:id' />

                    {/* Notifications */}
                    <NotificationList path='notifications' />
                  </Router>
                  <Footer />
                </NavigationProvider>
              </AppUpdateProvider>
            </SocketProvider>
          </InitV2Provider>
        </InitProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
export default App
