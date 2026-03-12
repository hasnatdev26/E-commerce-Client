import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from './useAuth'
import API_BASE_URL from '../config/apiBase'

export const axiosSecure = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

const useAxiosSecure = () => {
  const navigate = useNavigate()
  const { logOut } = useAuth()

  useEffect(() => {
    const interceptorId = axiosSecure.interceptors.response.use(
      res => {
        return res
      },
      async error => {
        console.log('Error caught from axios interceptor-->', error.response)
        if (error.response.status === 401 || error.response.status === 403) {
          // logout
          logOut()
          // navigate to login
          navigate('/login')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosSecure.interceptors.response.eject(interceptorId)
    }
  }, [logOut, navigate])

  return axiosSecure
}

export default useAxiosSecure
