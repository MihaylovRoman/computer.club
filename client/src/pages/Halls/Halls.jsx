import Hall from '../../components/Hall/Hall'
import './style.css'
import PropTypes from 'prop-types'
const Halls = ({halls}) => {
    
    return (
        <div className="container">
                <div>
                    <section className="board">
                        <div className="board-items">
                            {
                                halls.map((hall) => (
                                    <Hall key={hall.id} hall={hall}/>
                                ))
                            }
                        </div>
                    </section>
                </div>
            </div>
    )
}
Halls.propTypes = {
    halls: PropTypes.array
}

export default Halls