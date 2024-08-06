import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import './login&register.css'
const Register = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const validation = () => {
        if (password !== confirmPassword) {
            toast.error('password and confirm password muse be same')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (loading) return
        if (!validation()) return
        try {
            setLoading(true)
            const register = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(register.user, { name: name })
            toast.success('Registered Successfully')
            navigate('/login')
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error.message)
        }

    }

    return (
        <>

            <div className='register-login-container'>
                <div className='container'>
                    <h1>Register</h1>
                    <form onSubmit={ handleSubmit }>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={ name }
                            onChange={ (e) => setName(e.target.value) }
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={ email }
                            onChange={ (e) => setEmail(e.target.value) }
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={ password }
                            onChange={ (e) => setPassword(e.target.value) }
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={ confirmPassword }
                            onChange={ (e) => setConfirmPassword(e.target.value) }
                            required
                        />
                        <button type="submit" disabled={ loading }>Sign Up</button>
                    </form>
                    <p>Already have an account? <Link to='/login'>Sign In</Link></p>
                </div>
            </div>
        </>
    )
}

export default Register
