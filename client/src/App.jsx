import { useEffect, useState } from 'react'
import { useError } from './store/ErrorStore'
import { useUser } from './store/UserStore'
import { Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header/Header'
import Register from './pages/Register/Register'
import Loading from './components/Loading/Loading'
import Login from './pages/Login/Login'
import Error from './components/Error/Error'
import { check } from './http/userAPI'
import TopUpBalance from './pages/TopUpBalance/TopUpBalance'
import AdminPanel from './pages/AdminPanel/AdminPanel'
import HallAdd from './pages/HallAdd/HallAdd'
function App() {

  const { createError, isError, clearError } = useError()
  const { loginUser, logoutUser, user } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {

      check()
        .then(data => {
          loginUser(data.user, data.token)
        })
        .catch(() => {
          logoutUser()
        })
        .finally(() => setIsLoading(false))
    }, 3000)

  }, [])





  useEffect(() => {
    if (isError.active) {
      const timer = setTimeout(() => {
        clearError()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isError, clearError])

  function PrivateRoute({ children }) {
    const token = localStorage.getItem('token')
    return token ? children : <Navigate to='/login' />
  }

  function AdminRoute({ children }) {
    return user && user.role === 'ADMIN' ? children : <Navigate to='/' />
  }

  if (isLoading) {
    return <Loading />
  }


  return (
    <>
      {
        isError.active ? <Error error={isError} /> : ''
      }
      <Header />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/top-up-balance' element={<PrivateRoute><TopUpBalance /></PrivateRoute>} />
        <Route path='/admin-panel' element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path='/hall-add' element={<AdminRoute><HallAdd /></AdminRoute>} />
        <Route path='/hall-remove' element={<AdminRoute></AdminRoute>} />
      </Routes>
    </>
  )
}

export default App
