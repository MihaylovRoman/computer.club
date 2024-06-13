import { useEffect, useState } from 'react'
import './style.css'
import PropTypes from 'prop-types'
import { getSeatsByBookedId } from '../../http/bookedAPI'


const Booked = ({ booked }) => {
    const [seats, setSeats] = useState([])

    const handleCancelBooked = () => {

    }

    const handleStartBooked = () => {

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
            <button className='booked__complete'>Активировать</button>
            <button className='booked__cancel'>Отменить</button>
        </div>
    )
}

Booked.propTypes = {
    booked: PropTypes.object
}

export default Booked