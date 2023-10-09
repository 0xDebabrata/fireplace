'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import toast, { Toaster } from "react-hot-toast"

import styles from "../../../../styles/Create.module.css"

interface JoinClientProps {
  params: {
    creatorId: string;
    id: string;
  };
}

export default function JoinClientComponent({ params }: JoinClientProps) {
  const router = useRouter()

  const [nickname, setNickname] = useState("")

  const handleClick = () => {
    if (!nickname) {
      // toast alert
      toast.error("Please enter a nickname")
    } else {
      // Join watchparty
      const { creatorId, id } = params
      const link = `/${creatorId}/${id}/join/`
      router.push(`${link}${nickname}/`)
    }
  }

  return (
    <>
      <div className={styles.nicknameContainer}>
        <div className={styles.wrapper}>
          <input 
            className={styles.input}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Enter a nickname" />
          <button
            onClick={handleClick}
            className={styles.button}
          >
            Join watchparty
          </button>
        </div>
      </div>
      <Toaster
        toastOptions={{
          style: {
          minWidth: "300px"
          }
        }} 
      />
    </>
  )
}
