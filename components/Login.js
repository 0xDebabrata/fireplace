import React, { useState } from 'react'
import {supabase} from '../utils/supabaseClient'
import toast from 'react-hot-toast'

import styles from '../styles/Login.module.css'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newUser, setNewUser] = useState(false)
    const [forgot, setForgot] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email) => {
        try {
            setLoading(true)
            if (newUser) {
                const { user, session, error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
            } else {
                const { user, session, error } = await supabase.auth.signIn({ email, password })
                if (error) throw error
            }
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const sendResetLink = async (email) => {
        try {
            setLoading(true)
            const { data, error } = await supabase.auth.api
                .resetPasswordForEmail(email)
            if (error) throw error
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = async (e) => {
        e.preventDefault()

        const promise = handleLogin(email) 

        toast.promise(promise, {
            loading: "Checking credentials",
            success: "Logging in...",
            error: (err) => {
                return err.message
            } 
        })
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()

        const promise = sendResetLink(email) 

        toast.promise(promise, {
            loading: "Sending email",
            success: "Check your email for password reset link",
            error: (err) => {
                return err.message
            } 
        }, {
            duration: 5000
        })
    }

    if (forgot) {
        return (
            <div className={styles.parent}>
                <div className={styles.resetContainer}>
                    <h1 className={styles.header}>
                        Reset password
                    </h1>
                    <div className={styles.wrapper}>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className={styles.span}>
                            <button
                                className={styles.resetButton}
                                onClick={(e) => handleForgotPassword(e)}
                                disabled={loading}
                            >
                                {loading ? "Loading" : "Reset password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.parent}>
            <div className={styles.container}>
                <h1 className={styles.header}>
                    {newUser ? "Sign Up" : "Login"}
                </h1>
                <div className={styles.wrapper}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    
                    <div className={styles.span}>
                        <button
                            className={styles.button}
                            onClick={(e) => handleClick(e)}
                            disabled={loading}
                        >
                            {loading ? "Loading" : 
                                    newUser ? "Sign Up" : "Login" }
                        </button>
                        {!newUser && (
                            <p onClick={() => setForgot(true)}>Forgot password?</p>
                        )}
                    </div>
                </div>
        {newUser && (
                <p className={styles.newUser}>
                    Existing user? <span onClick={() => setNewUser(false)}>Login</span>
                </p>
                )}
        {!newUser && (
                <p className={styles.newUser}>
                    New user? <span onClick={() => setNewUser(true)}>Sign up</span>
                </p>
                )}
            </div>
        </div>
    )
}

export default Login
