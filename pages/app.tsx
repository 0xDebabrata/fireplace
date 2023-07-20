import { useEffect, useState } from "react"
import { supabase } from '../utils/supabaseClient'

import Navbar from "../components/Navbar"
import Files from '../components/Files.js'
import UploadButton from '../components/UploadButton'

export default function Application() {
  const [flag, setFlag] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) {
    <>
    </>
  }

  return (
    <div>
      <Navbar />
      <Files flag={flag} />
      <UploadButton flag={flag} setFlag={setFlag} />
    </div>
  )
}
