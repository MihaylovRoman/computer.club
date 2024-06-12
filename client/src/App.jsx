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
function App() {

  const { createError, isError, clearError } = useError()
  const { loginUser, logoutUser } = useUser()
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
      </Routes>
    </>
  )
}

export default App
