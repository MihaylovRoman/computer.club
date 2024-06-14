import { useEffect, useState } from 'react'
import { useError } from './store/ErrorStore'
import { useUser } from './store/UserStore'
import { Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header/Header'
import Register from './pages/Register/Register'
import Loading from './components/Loading/Loading'
import Login from './pages/Login/Login'
import Error from './components/Error/Error'
import { check, tokenUpdate } from './http/userAPI'
import TopUpBalance from './pages/TopUpBalance/TopUpBalance'
import AdminPanel from './pages/AdminPanel/AdminPanel'
import HallAdd from './pages/HallAdd/HallAdd'
import Halls from './pages/Halls/Halls'
import { getAllHalls } from './http/hallAPI'
import CurrentHall from './pages/CurrentHall/CurrentHall'
import UserReservations from './pages/UserReservations/UserReservations'
function App() {

	const { createError, isError, clearError } = useError()
	const { loginUser, logoutUser, user } = useUser()
	const [isLoading, setIsLoading] = useState(true)
	const [halls, setHalls] = useState([])


	useEffect(() => {
		getAllHalls().then(data => setHalls(data)).catch()
	}, [])

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
		const updateToken = async () => {
			try {
				tokenUpdate().then(data => loginUser(data.user, data.token))
			} catch (e) {
				console.log('Ошибка обновления токена')
			}
		}

		const interval = setInterval(updateToken, 5*60*1000)

		return () => clearInterval(interval)
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
		const token = localStorage.getItem('token')
		return token && user.role === 'ADMIN' ? children : <Navigate to='/' />
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
				<Route path='/halls' element={<Halls halls={halls} />} />
				<Route path='/hall/:name' element={<CurrentHall />} />
				<Route path='/user-reservations' element={<PrivateRoute><UserReservations /></PrivateRoute>} />
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
