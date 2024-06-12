import { $authHost, $host } from "./index";
import { jwtDecode } from 'jwt-decode'

export const register = async (name, phone, password, confirmPassword) => {
    const { data } = await $host.post('api/register', { name, phone, password, confirmPassword})
    return data
}

export const login = async (phone, password) => {
    const { data } = await $host.post('api/login', { phone, password })
    localStorage.setItem('token', data.token)
    return {
        user: jwtDecode(data.token),
        token: data.token
    }
}

export const check = async () => {
    const { data } = await $authHost.get('api/auth')
    localStorage.setItem('token', data.token)
    return {
        user: jwtDecode(data.token),
        token: data.token
    }
}