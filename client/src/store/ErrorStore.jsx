import { createContext, useContext, useState } from 'react'

const ErrorContext = createContext()

export const ErrorProvider = ({ children }) => {

    const [isError, setIsError] = useState({
        message: "",
        status: "",
        active: false
    })

    const createError = (message, status) => {
        setIsError({
            message,
            status,
            active: true
        })
    }
    
    const clearError = () => {
        setIsError({
            message: "",
            status: '',
            active: false
        })
    }

    return (
        <ErrorContext.Provider value={{ isError, createError, clearError }}>
            {children}
        </ErrorContext.Provider>
    )
}

export const useError = () => useContext(ErrorContext)



