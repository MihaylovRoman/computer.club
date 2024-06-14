import { useEffect, useState } from 'react'
import './style.css'
import PropTypes from 'prop-types'
import { activateBooked, cancelBooked, getSeatsByBookedId } from '../../http/bookedAPI'
import { useError } from '../../store/ErrorStore'


const Booked = ({ booked }) => {
    const [seats, setSeats] = useState([])
    const { createError } = useError()

    const handleCancelBooked = () => {
        cancelBooked(booked.id).then(data => createError(data.message, 200)).catch(e => createError(e.response.data.message, 400))
    }

    const handleStartBooked = () => {
        activateBooked(booked.id).then(data => createError(data.message, 200)).catch(e => createError(e.response.data.message, 400))
    }

    useEffect(() => {
        getSeatsByBookedId(booked.id).then(data => setSeats(data)).catch()
    }, [])

    return (
        <div className='booked-wrapper'>
            <div>
                <p>{`Зал: ${booked.hallId}`}</p>
                <p>{`Количество мест: ${seats.length}`}</p>
                <p>Номера мест:</p>
                <div className='seat-scroll'>
                    {
                        seats.map(seat =>
                        (
                            <div key={seat.id} className='seat-number'>
                                <span>{seat.id}</span>
                            </div>
                        ))
                    }
                </div>
                <p>{`Количество часов: ${booked.hours}`}</p>
                <p>{`Цена: ${booked.total} ₽`}</p>
            </div>
            <button className={booked.status === "PROCESS" ? 'booked__complete booked__process' : 'booked__complete'} disabled={booked.status === 'PROCESS' ? true : false} onClick={() => handleStartBooked()}>Активировать</button>
            <button className='booked__cancel' onClick={() => handleCancelBooked()}>Отменить</button>
        </div>
    )
}

Booked.propTypes = {
    booked: PropTypes.object
}

export default Booked