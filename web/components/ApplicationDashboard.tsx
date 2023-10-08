'use client'

import { useState } from "react"

import Files from '../components/Files'
import UploadButton from '../components/UploadButton'

export default function ApplicationDashboard() {
  const [flag, setFlag] = useState(false)

  return (
    <div className="bg-neutral-900">
      <Files flag={flag} />
      <UploadButton flag={flag} setFlag={setFlag} />
    </div>
  )
}
