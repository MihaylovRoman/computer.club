import { $authHost, $host } from "./index";

export const getAllBooked = async () => {
    const { data } = await $authHost.get('/api/getAllBooked')
    return data
}

export const getSeatsByBookedId = async (bookedId) => {
    const { data } = await $authHost.get('/api/getSeatsByBookedId', { params: { bookedId } })
    return data
}

export const cancelBooked = async (bookedId) => {
    const { data } = await $authHost.delete(`/api/cancelBooked/${bookedId}`)
    return data
}

export const activateBooked = async (bookedId) => {
    const { data } = await $authHost.put('/api/activateBooked', { bookedId })
    return data
}