import './index.css'

import { Router } from '@reach/router'

import UserList from 'pages/UserList'
import UserDetail from 'pages/UserDetail'

import NotificationList from 'pages/NotificationList'

import PostList from 'pages/PostList'
import PostDetail from 'pages/PostDetail'
import PostEdit from 'pages/PostEdit'

import ChatList from 'pages/ChatList'
import ChatDetail from 'pages/ChatDetail'
import RequestList from 'pages/RequestList'

import Login from 'pages/Login'
import Invite from 'pages/Invite'

import Footer from 'components/Footer'
import AppUpdateProvider from 'components/AppUpdateProvider'
import AuthProvider from 'components/AuthProvider'
import useGlobalFuncs from 'hooks/useGlobalFuncs'
import InitProvider from 'components/InitProvider'
import NavigationProvider from 'components/NavigationProvider'
import useSavePushToken from 'hooks/savePushToken'
import { Toaster } from 'react-hot-toast'

const App = () => {
  useSavePushToken()
  useGlobalFuncs()
  return (
    <AuthProvider>
      <InitProvider>
        <AppUpdateProvider>
          <NavigationProvider>
            <Toaster />
            <Router className='h-screen w-screen' primary={false}>
              {/* Setup */}
              <Login path='login' />
              <Invite path='invite' />

              {/* Users */}
              <UserList path='users' />
              <UserDetail path='users/:id' />

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
      </InitProvider>
    </AuthProvider>
  )
}
export default App
