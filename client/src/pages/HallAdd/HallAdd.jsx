import { useState } from 'react';
import { registerHall } from '../../http/hallAPI';
import { useError } from '../../store/ErrorStore'
import './style.css'

//IMAGES
import fileIcon from '../../assets/icons/fileIcon.png'


const HallAdd = () => {
    const [countFile, setCountFile] = useState(0)
    const { createError } = useError()
    const [formData, setFormData] = useState({
        name: '',
        image: null,
        quantity: null,
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'image') {
            setCountFile(1)
            setFormData({
                ...formData,
                [name]: e.target.files[0]
            })
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const total = new FormData()
        total.append('name', formData.name)
        total.append('image', formData.image)
        total.append('price', formData.price)
        total.append('quantity', formData.quantity)

        await registerHall(total).then(data => {
            createError(data.message, 200)
            setFormData({
                name: '',
                image: null,
                quantity: null,
                price: ''
            })

        }).catch(e => createError(e.response.data.message, 400))

    };

    return (
        <div className="registration-container">
            <h2 className="title">Добаление зала</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label" htmlFor="name">Название</label>
                    <input
                        placeholder='Standart'
                        className="input"
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="price">Цена за час</label>
                    <input
                        placeholder='100'
                        className="input"
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="quantity">Количество мест</label>
                    <input
                        placeholder='5'
                        className="input"
                        type="text"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </div>
                <div className='form-group'>
                    <label className='label' htmlFor="">Фото</label>
                    <div className="input__wrapper">
                        <input name="image" type="file" onChange={(e) => handleChange(e)} id="input__file" className="input input__file" accept='image/*' />
                        <label htmlFor="input__file" className="input__file-button">
                            <span className="input__file-icon-wrapper"><img className="fileIcon" src={fileIcon} alt="Файл" width="25" /></span>
                            <span className="input__file-button-text">Выбрано: {countFile}</span>
                        </label>
                    </div>
                </div>
                <button className="button" type="submit">Добавить</button>
            </form>
        </div>
    )
}

export default HallAdd