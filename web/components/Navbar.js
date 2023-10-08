import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Image from 'next/image'
import { useRouter } from 'next/router'

import styles from '../styles/Navbar.module.css'

const Navbar = () => {
  const router = useRouter()
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <nav className={styles.navbar}>
      <Image
        onClick={() => router.push("/")}
        className={styles.logo}
        src="/Logo.png"
        alt="fireplace logo"
        height={50}
        width={160}
      />

      {session ? <Logout /> : null } 
    </nav>
  )
}

const Logout = () => {
  const handleLogout = () => {
    supabase.auth.signOut()
  }

  return (
    <button
      className={styles.logout}
      onClick={handleLogout}
    >
      Logout
    </button>
  )
}

export default Navbar




