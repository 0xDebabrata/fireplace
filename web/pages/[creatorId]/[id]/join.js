import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/router"

import Login from "../../../components/Login"
import { useSession } from "../../../utils/hooks/useSession"

import styles from "../../../styles/Create.module.css"

const Join = () => {
  const session = useSession()
  const [nickname, setNickname] = useState("")
  const [link, setLink] = useState(null)
  const router = useRouter()

  const handleClick = () => {
    if (!nickname) {
      // toast alert
      toast.error("Please enter a nickname")
    } else {
      // Join watchparty
      router.push(`${link}${nickname}/`)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      const { creatorId, id } = router.query
      setLink(`/${creatorId}/${id}/join/`)
    }
  }, [router.isReady, router.query])

  return (
    <>
      {session ?
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
      :
        <Login />
      }
    </>
  )
}

export default Join
