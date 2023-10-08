import { supabase } from '../utils/supabaseClient'
import Image from 'next/image'
import { useRouter } from 'next/router'

import styles from '../styles/Navbar.module.css'
import { useSession } from '../utils/hooks/useSession'

const Navbar = () => {
  const router = useRouter()
  const session = useSession()

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

      <Logout />
      {session ? <Logout /> : null } 
    </nav>
  )
}

const Logout = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error)
    }
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
