import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ErrorProvider } from './store/ErrorStore'
import { UserProvider } from './store/UserStore'
ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ErrorProvider>
          <App />
        </ErrorProvider>
      </UserProvider>
    </BrowserRouter >
  </React.StrictMode>
)
