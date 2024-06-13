import { $authHost, $host } from "./index";

export const registerHall = async (formData) => {
    const { data } = await $authHost.post('/api/registerHall', formData)
    return data
}

export const deleteHall = async (hallId) => {
    const { data } = await $authHost.delete('/api/deleteHall', { hallId })
    return data
}

export const getHall = async (name) => {
    const { data } = await $host.get(`/api/getHall/${name}`)
    return data
}

export const getAllHalls = async () => {
    const { data } = await $host.get('/api/getAllHalls')
    return data
}
