import React, { createContext, useContext, useEffect, useState } from 'react'
import useAuth from '../hook/useAuth'
import { useQuery } from '@tanstack/react-query'
import apiReq from '../../utils/axiosReq'


export const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const { token } = useAuth()

  const { data } = useQuery({
    enabled: !!token,
    queryKey: ['user'],
    queryFn: () => apiReq.get('api/auth/me', { headers: { Authorization: token } }),
  })
  useEffect(() => {
    if (data) {
      setUser(data.data)
    }
  }, [data])

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}
export default UserProvider