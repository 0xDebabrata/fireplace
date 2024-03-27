'use client'

import { useState } from "react"

import Files from '../components/Files'
import UploadButton from '../components/UploadButton'

export default function ApplicationDashboard() {
  const [flag, setFlag] = useState(false)

  return (
    <div className="bg-neutral-900">
      <div className="flex space-x-5 px-20 py-6">
        <h1 className="text-2xl text-white">
          Your library
        </h1>
        <UploadButton flag={flag} setFlag={setFlag} />
      </div>
      <Files flag={flag} />
    </div>
  )
}
