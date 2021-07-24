import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import store from 'state/store'
import App from './App'
import { Provider } from 'react-redux'
import { Router } from '@reach/router'

//@Todo moving back doesn't remember scroll position

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router className="h-screen w-screen" primary={false}>
        <App path="*" />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
