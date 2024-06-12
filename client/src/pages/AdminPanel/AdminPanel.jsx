import './style.css'
import { NavLink } from 'react-router-dom'
const AdminPanel = () => {
    return (
        <div className='general-container'>
            <div className='buttons-controller'>
                <NavLink className='nav-link-button' to='/hall-add'>Добавить зал</NavLink>
                <NavLink className='nav-link-button' to='/hall-remove'>Удалить зал</NavLink>
                <NavLink className='nav-link-button' to='/service-add'>Добавить услугу</NavLink>
            </div>
        </div>
    );
};

export default AdminPanel