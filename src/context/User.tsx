import React, { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext(null)

export default function CountProvider({ children }) {
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used within a UserProvider')
    const { user, setUser } = context
    return { user, setUser }
}
