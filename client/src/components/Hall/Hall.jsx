import { BASE_SERVER_URL } from '../../constants'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const Hall = ({ hall }) => {

    return (
        <NavLink to={`/hall/${hall.name}`} className='hall-item'>
            <img className='hall-item__image' src={`${BASE_SERVER_URL}${hall.image}`} alt="image" />
            <div className='hall-item__shadow'></div>
            <p className='hall-item__tag'>{hall.name}</p>
        </NavLink>
    )
}

Hall.propTypes = {
    hall: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        image: PropTypes.string
    })
}

export default Hall