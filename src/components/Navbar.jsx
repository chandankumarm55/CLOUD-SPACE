import React from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await signOut(auth)
            navigate('/login')
            toast.success('Logout Successfully')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className='navbar'>
            <div className="brand-name">
                <h2>CLOUD-SPACE </h2>
            </div>
            <div className='logout'>
                <button onClick={ handleLogout }>Logout</button>
            </div>
        </div>
    )
}

export default Navbar
