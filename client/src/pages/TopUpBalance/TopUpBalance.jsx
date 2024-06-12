import { topUpBalance } from '../../http/userAPI';
import { useNavigate } from 'react-router-dom'
import { useError } from '../../store/ErrorStore'
import { useUser } from '../../store/UserStore'
import './style.css'
import { useState } from 'react';
const TopUpBalance = () => {
    const { user, loginUser } = useUser()
    const navigate = useNavigate()
    const { createError } = useError()
    const [money, setMoney] = useState(100);

    const handleChange = (e) => {
        const { value } = e.target;
        setMoney(value);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        
            await topUpBalance(user.id, money).then(data => {
                loginUser(data.user, data.token)
            }).catch(e => createError(e.response.data.message, 400))
            navigate('/')
    };


    return (
        <div className="registration-container">
            <h2 className="title">Пополнение баланса</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label" htmlFor="money">Перевести:</label>
                    <input
                        placeholder='100'
                        className="input"
                        type="text"
                        id="money"
                        name="money"
                        maxLength={6}
                        value={money}
                        onChange={handleChange}
                    />
                </div>
                <button className="button" type="submit">Пополнить баланс</button>
            </form>
        </div>
    )
}

export default TopUpBalance