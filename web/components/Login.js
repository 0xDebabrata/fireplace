import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {supabase} from '../utils/supabaseClient'
import toast from 'react-hot-toast'

import styles from '../styles/Login.module.css'

const Login = () => {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [newUser, setNewUser] = useState(false)
    const [forgot, setForgot] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email) => {
        try {
            setLoading(true)
            if (newUser) {
                const { error } = await supabase.auth.signUp({ email, password }, {
                    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`
                })
                if (error) throw error
            } else {
                const { error } = await supabase.auth.signIn({ email, password }, {
                    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`
                })
                if (error) throw error
            }
            router.push("/app")
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
                <h1 className="text-2xl text-yellow-500 font-medium">
                    {newUser ? "Sign Up" : "Login"}
                </h1>
                <div className={styles.wrapper}>
                    <input
                        className="mb-4 text-white w-full rounded-lg text-base bg-black px-4 py-1"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full text-white rounded-lg text-base bg-black px-4 py-1"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    
                    <div className="my-5 w-full flex justify-between items-center">
                        <div className='flex-1 text-left'>
                            <button
                                className="px-4 py-1 rounded-lg text-neutral-200 border border-neutral-500 hover:bg-neutral-500 duration-150"
                                onClick={(e) => handleClick(e)}
                                disabled={loading}
                            >
                                {loading ? "Loading" : 
                                        newUser ? "Sign Up" : "Login" }
                            </button>
                        </div>
                        {!newUser && (
                            <p className='hover:cursor-pointer font-light text-neutral-300' onClick={() => setForgot(true)}>Forgot password?</p>
                        )}
                    </div>
                </div>
        {newUser && (
                <p className={styles.newUser}>
                    Existing user? <span onClick={() => setNewUser(false)}>Login</span>
                </p>
                )}
        {!newUser && (
                <p className={`${styles.newUser}`}>
                    New user? <span onClick={() => setNewUser(true)}>Sign up</span>
                </p>
                )}
            </div>
        </div>
    )
}

export default Login
