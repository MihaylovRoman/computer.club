import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    const loginUser = (objUser, token) => {
        setUser(objUser)
        setToken(token)
        
    }
    const logoutUser = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
    };

    return (
        <UserContext.Provider value={{ user, token, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)



