import { useRouter } from "next/router"
import React, { useState } from 'react'
import {supabase} from '../utils/supabaseClient'
import toast from 'react-hot-toast'

import styles from '../styles/Login.module.css'

const Recovery = ({ token }) => {
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const updatePassword = async (token, password) => {
        try {
            setLoading(true)
            const { data, error } = await supabase.auth.api
                .updateUser(token, { password })
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

        const promise = updatePassword(token, password) 

        toast.promise(promise, {
            loading: "Updating password",
            success: () => {
                router.reload()
                return "Password updated. Logging in..."
            },
            error: (err) => {
                return err.message
            } 
        })
    }

    return (
        <div className={styles.parent}>
            <div className={styles.resetContainer}>
                <h1 className={styles.header}>
                    Update password
                </h1>
                <div className={styles.wrapper}>
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div className={styles.span}>
                        <button
                            className={styles.resetButton}
                            onClick={(e) => handleClick(e)}
                            disabled={loading}
                        >
                            {loading ? "Loading" : "Update password"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recovery
