import { useState } from "react"

import Navbar from "../components/Navbar"
import Files from '../components/Files.js'
import UploadButton from '../components/UploadButton'
import { useSession } from "../utils/hooks/useSession"

export default function Application() {
  const [flag, setFlag] = useState(false)
  const session = useSession()

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
