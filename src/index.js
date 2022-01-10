import React from 'react'
import ReactDOM from 'react-dom'
import './sentry'
import './logrocket'
import './index.css'
import './i18n'
import store from 'state/store'
import App from './App'
import { Provider } from 'react-redux'
import { Router } from '@reach/router'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router className='h-screen w-screen' primary={false}>
        <App path='*' />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
