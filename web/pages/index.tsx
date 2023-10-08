import { useState } from 'react'

import HomePage from "../components/home/"
import Navbar from "../components/Navbar"
import Files from '../components/Files.js'
import UploadButton from '../components/UploadButton'
import { useSession } from '../utils/hooks/useSession'


export default function Home() {
  const session = useSession()
  const [flag, setFlag] = useState(false)

  return (
    <div>
      {!session && <HomePage />}
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
