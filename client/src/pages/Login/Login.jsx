import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import InputMask from 'react-input-mask';
import { login } from "../../http/userAPI";
import { useError } from "../../store/ErrorStore";
import { useUser } from "../../store/UserStore";


const Login = () => {
    const navigate = useNavigate()
    const { createError } = useError()
    const { loginUser } = useUser()
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const data = await login(formData.phone, formData.password)
            if (data.token) {
                loginUser(data.user, data.token)
                navigate('/')
                createError("Авторизация прошла успешно", 200)
            }
        } catch (e) {
            createError(e.response.data.message, 400)
        }
        console.log(formData);
    };


    return (
        <div className="registration-container">
            <h2 className="title">Авторизация</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label" htmlFor="email">Телефон:</label>
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
                        onChange={e => handleChange(e)}
                    />
                </div>
                <button className="button" type="submit">Авторизация</button>
            </form>
        </div>
    )
}

export default Login