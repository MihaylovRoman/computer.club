import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useError } from '../../store/ErrorStore'
import './style.css'
import { getAllBooked } from '../../http/bookedAPI'
import Booked from '../../components/Booked/Booked'

const UserReservations = () => {
    const navigate = useNavigate()

    const { createError } = useError()
    const [bookeds, setBookeds] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        getAllBooked()
            .then(data => setBookeds(data))
            .catch((e) => {
                navigate('/')
                createError(e.response.data.message, 400)
            }).finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return ''
    }

    return (
        <div className='container'>
            <div>
                <div>
                    <section className="board">
                        <div className="board-items">

                            {
                                bookeds.map((booked) => <Booked key={booked.id} booked={booked} />)
                            }

                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default UserReservations