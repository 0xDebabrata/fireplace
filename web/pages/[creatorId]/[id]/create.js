import { useRouter } from 'next/router'
import { supabase } from '../../../utils/supabaseClient'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Navbar from "../../../components/Navbar"
import Loader from '../../../components/Loading'
import { createWatchparty, handleClick, copyLink } from '../../../functions/create'

import styles from '../../../styles/Create.module.css'

const Create = () => {
  const [loading, setLoading] = useState(true)
  const [creatorUserId, setCreatorUserId] = useState(null)
  const [partyId, setPartyId] = useState(null)
  const [nickname, setNickname] = useState("")
  const [link, setLink] = useState(null)

  const router = useRouter()

  useEffect(() => {
    if (!supabase.auth.user()) return

    setLoading(true)
    const clientId = supabase.auth.user().id

    if (router.isReady) {
      const { creatorId, id } = router.query
      setCreatorUserId(creatorId)
      setPartyId(id)
      setLink(`${creatorId}/${id}/join/`)

        if (creatorId === clientId) {
          createWatchparty(id, clientId, supabase, setLoading)
        }
      }
    }, [router.isReady, router.query, supabase.auth.user()])

  return (
    <>
      <Navbar />
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
    </>
  )
}

export default Create 
