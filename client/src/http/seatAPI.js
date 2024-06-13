import { $authHost, $host } from "./index";

export const occupiedSeat = async (seats) => {
    const { data } = await $authHost.post('/api/occupiedSeats', { seats })
    return data
}

export const getAllSeats = async (name) => {
    const { data } = await $host.get(`/api/getAllSeats/${name}`)
    return data
}

export const occupiedSeats = async (seats, userId, hallName, total, hours) => {
    const { data } = await $authHost.post(`/api/occupiedSeats`, { seats, userId, hallName, total, hours })
    return data
}
