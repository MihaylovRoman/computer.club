import './style.css'
import PropTypes from 'prop-types';

const Error = ({error}) => {

    
    
    return (
        <div className={error.active ? `errorMessage status-${error.status}` : 'errorMessage'}>{error.message}</div>
    )
}

Error.propTypes = {
    error: PropTypes.shape({
      status: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired
    }).isRequired
  };

export default Error