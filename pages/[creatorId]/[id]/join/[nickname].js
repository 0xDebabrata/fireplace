import useSWR from "swr"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import WebSocket from 'isomorphic-ws'
import { supabase } from "../../../../utils/supabaseClient"
import toast from "react-hot-toast"

import Loader from "../../../../components/Loading"
import { getAudioIO, refreshToken } from "../../../../functions/dolby"
import { handlePlay, handlePause, handleSeeked, loadStartPosition, updatePlayhead, keepAlive } from "../../../../functions/watchparty"

import styles from "../../../../styles/Watch.module.css"

const fetcher = (url) => fetch(url).then(data => { return data.json() })

const Watch = () => {

    const ws = useRef(null)

    const [accessToken, setAccessToken] = useState(null)
    const [creatorUserId, setCreatorUserId] = useState(null)
    const [partyId, setPartyId] = useState(null)
    const [creator, setCreator] = useState(false)
    const [videoSrc, setVideoSrc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [playheadStart, setPlayheadStart] = useState(0)
    const [show, setShow] = useState(true)
    const [conn, setConn] = useState(false)

    // Get Dolby access token from server
    const { data, error } = useSWR("/api/token", fetcher)

    const router = useRouter()

    const initialiseDolby = async () => {
        const VoxeetSDK = (await import("@voxeet/voxeet-web-sdk")).default
        if (data && !accessToken) {
            setAccessToken(data.accessToken)
            VoxeetSDK.initializeToken(accessToken, refreshToken)
            console.log("voxeet initialised")
            getAudioIO(VoxeetSDK)
        }
    }

    useEffect(() => {
        initialiseDolby()
    })

    useEffect(() => {
        const clientId = supabase.auth.user().id

        if (!clientId) {
            alert("You need to be logged in")
            return
        }
            
        if (router.isReady) {
            const { creatorId, id, nickname } = router.query

            if (supabase.auth.session()) {
                if (creatorId === supabase.auth.user().id) {
                    setCreator(true)
                    setCreatorUserId(creatorId)
                    setPartyId(id)
                }
            }

            ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/${clientId}`)

            // Send join watchparty request to server
            const payload = {
                "method": "join",
                "clientId": clientId,
                "nickname": nickname,
                "partyId": id
            }

            ws.current.onopen = () => {
                ws.current.send(JSON.stringify(payload))
                setConn(true)
            }

        }

        return () => {
            if (ws.current) {
                ws.current.close()
            }
        }

    }, [router.isReady, router.query])

    useEffect(() => {
        if (!conn) return; 

        ws.current.onmessage = message => {
            const response = JSON.parse(message.data)
            const vid = document.getElementById("video")

            if (response.method === "join") {
                setVideoSrc(response.party.src)
                setLoading(false)
                setPlayheadStart(response.party.playhead)

                const partyId = response.party.id

                if (creator) {
                    updatePlayhead(partyId, ws)
                } else {
                    keepAlive(ws)
                }
            }

            // New user joined watchparty
            if (response.method === "new") {
                toast(`${response.nickname} joined!`, {
                    icon: "✌️",
                    position: "top-right",
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                })
            }

            // A user left the watchparty
            if (response.method === "leave") {
                toast(`${response.nickname} left!`, {
                    icon: "👋",
                    position: "top-right",
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                })
            }

            if (response.method === "play") {
                if (!creator && !show) {
                    vid.play()
                }
            }

            if (response.method === "pause") {
                if (!creator && !show) {
                    vid.pause()
                }
            }

            if (response.method === "seeked") {
                vid.currentTime = response.playhead
            }
        }
    }, [creator, show, conn])

    return (
        <div>
            {loading ? <Loader loading={loading} /> :
            <div className={styles.container}>
                { creator ?
                    <video 
                        id="video"
                        src={videoSrc} 
                        autoPlay={true} 
                        controls={true}
                        onPlay={() => handlePlay(partyId, creatorUserId, ws)}
                        onPause={() => handlePause(partyId, creatorUserId, ws)}
                        onSeeked={() => handleSeeked(partyId, creatorUserId, ws)}
                        onLoadedMetadata={() => loadStartPosition(playheadStart)}
                    />
                    :
                    <video 
                        id="video"
                        src={videoSrc} 
                        autoPlay={false} 
                        onPlay={() => setShow(false)}
                        controls={show}
                        onLoadedMetadata={() => loadStartPosition(playheadStart)}
                    />
                }
            </div>
            }
        </div>
    )
}

export default Watch
