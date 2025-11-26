import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

const Profile = () => {
  const { backendUrl, token, navigate, setToken, setCartItems } = useContext(ShopContext)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login')
        return
      }
      try {
        const res = await fetch(backendUrl + '/api/user/me', {
          method: 'GET',
          headers: { token }
        })
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
        } else {
          // show error and redirect to login
          console.log('Profile fetch error:', data.message)
          navigate('/login')
        }
      } catch (err) {
        console.log(err)
        navigate('/login')
      }
    }

    fetchProfile()
  }, [backendUrl, token, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    navigate('/login')
  }

  return (
    <div className="py-10">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">
        My Profile
        </h2>
        {user ? (
          <div className="text-gray-700">
            <p><strong>Name:</strong> {user.name}</p>
            <br/>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading profile...</p>
        )}
      </div>
    </div>
  )
}

export default Profile
