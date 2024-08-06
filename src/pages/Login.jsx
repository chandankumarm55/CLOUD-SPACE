import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import './login&register.css'
const Login = () => {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')


    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const login = await signInWithEmailAndPassword(auth, email, password)
            if (login) {
                toast.success('Login Successfully')
                navigate('/')
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error.message)
        }
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        if (!email) {
            toast.error('Please provide the email')
        }
        try {
            setLoading(true)
            await sendPasswordResetEmail(auth, email)
            toast.success('Password Rest Email Sent ..!')
            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error.message)
        }

    }
    return (
        <>{
            isLogin ? (
                <div className='register-login-container'>
                    <div className='container'>
                        <h1>Login</h1>
                        <form onSubmit={ handleLogin }>
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
                            <button type="submit" disabled={ loading }>Sign In</button>
                        </form>
                        <p>Don't have an account? <Link to='/register'>Sign Up</Link></p>
                        <p>Forgot your password? <span className='forgot-password' onClick={ () => setIsLogin(false) }>Reset Password</span></p>

                    </div>
                </div>
            ) :
                (
                    <div className='register-login-container'>
                        <div className='container'>
                            <h1>Reset Your Password</h1>
                            <p>Make sure that email is already register to send password rest message ..!!</p>
                            <form onSubmit={ handlePasswordReset }>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={ email }
                                    onChange={ (e) => setEmail(e.target.value) }
                                    required
                                />
                                <button type="submit" disabled={ loading }>Confirm</button>
                                <button type="button" onClick={ () => setIsLogin(true) }>Back to Login</button>
                            </form>
                        </div>
                    </div>
                )
        }

        </>
    )
}

export default Login
