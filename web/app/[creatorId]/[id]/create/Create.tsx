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
            className={styles.input}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Enter a nickname" />
          <button
            onClick={() => handleClick(nickname, creatorUserId, partyId, toast, router)}
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Creating watchparty" : "Join watchparty"}
          </button>
        </div>

        <Loader loading={loading} />
        {!loading && (
          <div className={styles.wrapper}>
            <p>Share the following link</p>
            <input id="link" type="text" readOnly={true} value={`${process.env.NEXT_PUBLIC_SITE_URL}/${link}`} className={styles.url} />
            <button 
              onClick={() => copyLink(toast)}
              className={styles.copyButton}
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
