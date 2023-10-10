'use client'

import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import Loader from '../../../../components/Loading'
import { createWatchparty, handleClick, copyLink } from '../../../../functions/create'

import styles from '../../../../styles/Create.module.css'

interface CreateClientProps {
  params: {
    creatorId: string;
    id: string;
  },
  session: Session
}

export default function CreateClientComponent(props: CreateClientProps) {
  const { params, session } = props
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(true)
  const [creatorUserId, setCreatorUserId] = useState<string | null>(null)
  const [partyId, setPartyId] = useState<string | null>(null)
  const [nickname, setNickname] = useState("")
  const [link, setLink] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const clientId = session.user.id

    const { creatorId, id } = params
    setCreatorUserId(creatorId)
    setPartyId(id)
    setLink(`${creatorId}/${id}/join/`)

    if (creatorId === clientId) {
      createWatchparty(id, clientId, supabase, setLoading)
    }
  }, [])
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <input 
            className="px-3 py-1.5 w-full rounded-md bg-neutral-800 text-sm text-neutral-200"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Enter a nickname" />
          <button
            onClick={() => handleClick(nickname, creatorUserId, partyId, toast, router)}
            className="px-4 py-1.5 my-4 text-sm bg-yellow-500 text-neutral-800 rounded-md hover:bg-yellow-400 duration-150"
            disabled={loading}
          >
            {loading ? "Creating watchparty" : "Join watchparty"}
          </button>
        </div>

        <Loader loading={loading} />
        {!loading && (
          <div className={styles.wrapper}>
            <p className='text-left pb-3 text-sm text-neutral-300'>
              Others can join using the link below
            </p>
            <input 
              id="link"
              type="text"
              readOnly={true}
              value={`${process.env.NEXT_PUBLIC_SITE_URL}/${link}`}
              className="px-3 py-1.5 w-full rounded-md bg-neutral-800 text-sm text-neutral-200"
            />
            <button 
              onClick={() => copyLink(toast)}
              className="px-4 py-1.5 my-4 text-sm text-neutral-200 border border-neutral-500 hover:bg-neutral-600 rounded-md duration-150"
            >
              Copy link
            </button>
          </div>
        )}
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
