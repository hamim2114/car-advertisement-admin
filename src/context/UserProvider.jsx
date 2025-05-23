import React, { createContext, useContext, useEffect, useState } from 'react'
import useAuth from '../hook/useAuth'
import { useQuery } from '@tanstack/react-query'
import { axiosReq } from '../../utils/axiosReq'


export const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const { token } = useAuth()

  const { data } = useQuery({
    enabled: !!token,
    queryKey: ['user'],
    queryFn: () => axiosReq.get('/auth/me', { headers: { Authorization: token } }),
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