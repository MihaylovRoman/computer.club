import { useEffect, useState } from "react"
import { getHall } from "../../http/hallAPI"
import { useNavigate, useParams } from "react-router-dom"
import { useError } from "../../store/ErrorStore"
import { BASE_SERVER_URL } from "../../constants"
import { useUser } from '../../store/UserStore'
import './style.css'
import { getAllSeats, occupiedSeats } from "../../http/seatAPI"

//IMAGES
import GameSeat from "../../components/GameSeat/GameSeat"

const CurrentHall = () => {

    const { name } = useParams()
    const { createError } = useError()
    const { user } = useUser()
    const navigate = useNavigate()
    const [hall, setHall] = useState({})
    const [seats, setSeats] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedSeats, setSelectedSeats] = useState([])
    const [price, setPrice] = useState(0)
    const [hours, setHours] = useState(1)

    const handleSeatClick = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId))
        } else {
            setSelectedSeats([...selectedSeats, seatId])
        }
    }
    const handleOccupiedClick = () => {
        occupiedSeats(selectedSeats, user.id, name, price, hours).then(data => createError(data.message, 200)).catch(e => createError(e.response.data.message, 400))
        window.location.reload()
    }
    
    useEffect(() => {
        getHall(name).then(data => {
            setHall(data)
            getAllSeats(name).then(seats_data => setSeats(seats_data))
        }).catch(e => {
            createError(e.response.data.message, 400)
            navigate('/')
        }).finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        setPrice(hall.price * hours * selectedSeats.length)
    }, [hours, handleSeatClick])

    if (isLoading) {
        return ''
    }

    return (
        <>
            <div className="wrapperHall">
                <img className="hall-image" src={`${BASE_SERVER_URL}${hall.image}`} alt="" />
                <div className="hall-shadow"></div>
                <p className='hall-tag'>{hall.name}</p>
                <div className="container">
                    <div className="hall-board">
                        {
                            seats.map(seat => <GameSeat key={seat.id} seat={seat} onSeatClick={handleSeatClick} />)
                        }
                    </div>
                    <div className="computers-occupied">
                        <p>Забронировать</p>
                        <div className="occupied-hours">
                            <p>Количество часов</p>
                            <input value={hours} onChange={(e) => {
                                setHours(e.target.value)
                            }} type="text" className="occupied-hours__input" />
                            <p>{price} ₽</p>
                        </div>
                        <button className="computer-occupied__button" onClick={() => {
                            handleOccupiedClick()
                        }} disabled={selectedSeats.length != 0 && hours > 0 && user && user.role === "USER" ? false : true}>Забронировать</button>
                    </div>
                </div>

            </div>

        </>
    )
}

export default CurrentHall