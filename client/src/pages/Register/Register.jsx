import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './style.css'
import InputMask from 'react-input-mask';
import { register } from '../../http/userAPI';
import { useError } from '../../store/ErrorStore'


const Register = () => {
    const navigate = useNavigate()
    const { createError } = useError()
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register(formData.name, formData.phone, formData.password, formData.confirmPassword)
            if (!res.message) {
                navigate('/login')
                createError('Регистрация прошла успешно', 200)
            }
        } catch (e) {
            createError(e.response.data.message, 400)
        }
        console.log(formData);
    };


    return (
        <div className="registration-container">
            <h2 className="title">Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label" htmlFor="name">Имя:</label>
                    <input
                        placeholder='Павел'
                        className="input"
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="phone">Телефон:</label>
                    <InputMask value={formData.phone} name='phone' onChange={e => handleChange(e)} mask={'+7 (999) 999-99-99'} maskChar={null} placeholder='+7 (999) 999-99-99' className='input' />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="password">Пароль:</label>
                    <input
                        placeholder='***'
                        className="input"
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="confirmPassword">Подтвердите пароль:</label>
                    <input
                        placeholder='***'
                        className="input"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button className="button" type="submit">Зарегистрироваться</button>
            </form>
        </div>
    )
}

export default Register