import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

import Navbar from "../components/Navbar"
import Login from '../components/Login.js'
import Files from '../components/Files.js'
import UploadButton from '../components/UploadButton'
import Recovery from '../components/Recovery'

import styles from '../styles/Home.module.css'

export default function Home() {

  const [session, setSession] = useState(null)
  const [reset, setReset] = useState(false)
  const [token, setToken] = useState(null)
  const [flag, setFlag] = useState(false)

  useEffect(() => {

    if (window.location.hash.substr(-8, 8) === "recovery") {
      setReset(true)
      const count = window.location.hash.search("&")
      const accessToken = window.location.hash.substr(14, count-14)
      setToken(accessToken)
    } else {
      setSession(supabase.auth.session())

      supabase.auth.onAuthStateChange((event, session) => {
        setSession(session)
      })
    }
  }, [])

  if (reset) {
    return (<Recovery token={token} />)
  }

  return (
    <div>
      {!session && <Login />}
      {session && (
        <>
          <Navbar />
          <Files flag={flag} />
          <UploadButton flag={flag} setFlag={setFlag} />
        </>
      )}
    </div>
  )
}
