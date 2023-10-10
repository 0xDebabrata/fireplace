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
      <div className="h-[200px] w-[350px] absolute top-0 bottom-0 left-0 right-0 m-auto bg-neutral-700 rounded-md flex flex-col justify-center items-center">
        <div className="px-10 text-right">
          <input 
            className="px-3 py-1.5 w-full rounded-md bg-neutral-800 text-sm text-neutral-200"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Enter a nickname" />
          <button
            onClick={handleClick}
            className="px-4 py-1.5 my-4 text-sm bg-yellow-500 text-neutral-800 rounded-md hover:bg-yellow-400 duration-150"
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
