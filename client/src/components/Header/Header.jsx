import { useState } from 'react'
import './style.css'
import { NavLink } from 'react-router-dom'
import { useUser } from '../../store/UserStore'

//IMAGES
import HomeImage from '../../assets/icons/home.png'
import ServicesImage from '../../assets/icons/services.png'
import MonitorImage from '../../assets/icons/monitor.png'
import BankCardImage from '../../assets/icons/bank-card.png'



const Header = () => {
    const { token, logoutUser, user } = useUser()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="wrapperMenu">
            <div className='header'>
                <NavLink to='/' className={({ isActive }) => isActive ? 'header-link activeLink' : 'header-link'}>
                    <div className='header-link__image'>
                        <img src={HomeImage} alt="" />
                    </div>
                    <p>Главная</p>
                </NavLink>
                <NavLink to='/price' className={({ isActive }) => isActive ? 'header-link activeLink' : 'header-link'}>
                    <div className='header-link__image'>
                        <img src={MonitorImage} alt="" />
                    </div>
                    <p>Залы</p>
                </NavLink>
                <NavLink to='/services' className={({ isActive }) => isActive ? 'header-link activeLink' : 'header-link'}>
                    <div className='header-link__image'>
                        <img src={ServicesImage} alt="" />
                    </div>
                    <p>Услуги</p>
                </NavLink>
            </div>
            <div className="user-controls">
                {
                    token ?
                        (
                            <div className='user-balance'>
                                <img src={BankCardImage} alt="" />
                                <p>{`${user.balance} ₽`}</p>
                            </div>
                        ) : ''
                }
                <div className="user-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>

                    <p className='user-menu__tag'>{token ? `${user.name}` : 'Гость'}</p>
                    {isMenuOpen && (
                        <ul>
                            {token ?
                                (
                                    <>
                                        <li><NavLink to='/user-reservations'>Брони</NavLink></li>
                                        <li><NavLink to='/reservation'>Забронировать</NavLink></li>
                                        <li><NavLink to='/top-up-balance'>Пополнить баланс</NavLink></li>
                                        <li><NavLink onClick={logoutUser} >Выход</NavLink></li>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <li><NavLink to='/login'>Вход</NavLink></li>
                                        <li><NavLink to='/register'>Регистрация</NavLink></li>
                                    </>
                                )
                            }
                        </ul>
                    )}
                </div>
            </div>
        </header >
    )
}

export default Header