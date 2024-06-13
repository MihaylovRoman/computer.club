import { useState } from 'react'

import PropTypes from 'prop-types'

//IMAGES
import GameChair from '../../assets/icons/chair.png'
import SelectMark from '../../assets/icons/mark.png'
import OccupiedMark from '../../assets/icons/occupied-mark.png'


const GameSeat = ({ seat, onSeatClick }) => {
    const [select, setSelect] = useState(false)

    const handleClick = () => {
        setSelect(!select)
        onSeatClick(seat.id)
    }


    return (
        <div className="hall-board__computer" onClick={() => seat.status === 'OCCUPIED' ? '' : handleClick()}>
            <img className="computer-chair" src={GameChair} alt="chair" />
            <p className="computer-number">{seat.id}</p>
            {
                select ? <img className='computer__mark' src={SelectMark} /> : ''
            }
            {
                seat.status === 'OCCUPIED' ? <img className='computer__mark' src={OccupiedMark} /> : ''
            }
        </div >
    )
}
GameSeat.propTypes = {
    seat: PropTypes.object,
    onSeatClick: PropTypes.func
}
export default GameSeat