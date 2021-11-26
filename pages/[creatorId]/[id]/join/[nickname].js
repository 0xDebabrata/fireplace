import { useRouter } from "next/router"
import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import WebSocket from 'isomorphic-ws'
import { supabase } from "../../../../utils/supabaseClient"
import toast from "react-hot-toast"

import MicStatus from '../../../../components/MicStatus'
import Loader from "../../../../components/Loading"
import { joinConference, openSession, getAccessToken, setSpatialEnvironment, setSpatialPosition } from "../../../../functions/dolby"
import { handlePlay, handlePause, handleSeeked, loadStartPosition, updatePlayhead, keepAlive } from "../../../../functions/watchparty"

import styles from "../../../../styles/Watch.module.css"

const Watch = () => {

    const ws = useRef(null)
    const VoxeetSDK = useRef()

    const [accessToken, setAccessToken] = useState(null)
    const [creatorUserId, setCreatorUserId] = useState(null)
    const [partyId, setPartyId] = useState(null)
    const [creator, setCreator] = useState(false)
    const [videoSrc, setVideoSrc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [playheadStart, setPlayheadStart] = useState(0)
    const [show, setShow] = useState(true)
    const [conn, setConn] = useState(false)
    const [status, setStatus] = useState()
    const [mute, setMute] = useState(false)

    const router = useRouter()

    const isConnected = (participant) => {
    return [ 'Decline', 'Error', 'Kicked', 'Left' ].indexOf(participant.status) < 0;
};

    const handleMute = () => {
        try {
            if (mute) {
                VoxeetSDK.current.conference.mute(VoxeetSDK.current.session.participant, false)
                setMute(false)
                setStatus("listening")
            } else {
                VoxeetSDK.current.conference.mute(VoxeetSDK.current.session.participant, true)
                setMute(true)
                setStatus("muted")
            }
        } catch (err) { console.error(err) }
    }

    const listenIsSpeaking = () => {
        setInterval(() => {
            [...VoxeetSDK.current.conference.participants].map(val => {
                const participant = val[1]
                VoxeetSDK.current.conference.isSpeaking(participant, (isSpeaking) => {
                    if (participant.id === VoxeetSDK.current.session.participant.id && isSpeaking) {
                        setStatus("speaking")
                    }
                })
            })
        }, 500)
    }

    const setSpatialEnvironment = () => {
        const right   = { x: 1, y: 0,  z: 0 };
        const forward = { x: 0, y: -1, z: 0 };
        const up      = { x: 0, y: 0,  z: 1 };
        const scale   = { x: window.innerWidth / 1, y: window.innerHeight / 1, z: 1 };

        VoxeetSDK.current.conference.setSpatialEnvironment(scale, forward, up, right);

        console.log("spatial environment set")
    }

    const setLocalPosition = () => {
        VoxeetSDK.current.conference.setSpatialPosition(VoxeetSDK.current.session.participant, {
            x: window.innerWidth/2,
            y: window.innerHeight/2,
            z: 0
        })

        console.group("Local position:")
        console.log({
            x: window.innerWidth/2,
            y: window.innerHeight/2,
            z: 0
        })
        console.groupEnd()
    }

    const setSpatialPosition = (participant, number) => {
        switch (number) {
            case 2:
                VoxeetSDK.current.conference.setSpatialPosition(participant, {
                    x: 0,
                    y: window.innerHeight/2,
                    z: 0
                })
                break;
            case 3:
                VoxeetSDK.current.conference.setSpatialPosition(participant, {
                    x: window.innerWidth,
                    y: window.innerHeight/2,
                    z: 0
                })
                break;
            case 4:
                VoxeetSDK.current.conference.setSpatialPosition(participant, {
                    x: window.innerWidth/2,
                    y: window.innerHeight,
                    z: 0
                })
                break;
            case 5:
                VoxeetSDK.current.conference.setSpatialPosition(participant, {
                    x: window.innerWidth/2,
                    y: 0,
                    z: 0
                })
        }
    }

    useEffect(() => {
        if (!router.isReady) return;

        getAccessToken()
            .then(async (token) => {
                VoxeetSDK.current = (await import("@voxeet/voxeet-web-sdk")).default
                VoxeetSDK.current.initializeToken(token, getAccessToken)
            })
            .then(async () => {
                await VoxeetSDK.current.session.open({ name: router.query.nickname })

                const conferenceOptions = {
                    alias: router.query.id,
                    params: {
                        dolbyVoice: true
                    }
                }

                const conference = await VoxeetSDK.current.conference.create(conferenceOptions)

                const joinOptions = {
                    constraints: {
                        audio: true,
                        video: false
                    },
                    preferRecvMono: false,
                    preferSendMono: false,
                    spatialAudio: true
                }

                await VoxeetSDK.current.conference.join(conference, joinOptions)
                setSpatialEnvironment()
                setLocalPosition()
                setStatus("listening")
                listenIsSpeaking()

                // Set remote positions
                const arr = [...VoxeetSDK.current.conference.participants]
                let flag = 2
                arr.map(val => {
                    const participant = val[1]
                    if (participant.id !== VoxeetSDK.current.session.participant.id) {
                        setSpatialPosition(participant, flag)
                        console.log("remote postion set")
                        flag += 1
                    }
                })

                VoxeetSDK.current.conference.on("participantUpdated", (participant) => {
                    if (isConnected(participant) && participant.id !== VoxeetSDK.current.session.participant.id) {
                        setSpatialPosition(participant, [...VoxeetSDK.current.conference.participants].length)
                        console.group(participant.id)
                        console.log([...VoxeetSDK.current.conference.participants].length)
                        console.log("set position for new participant")
                        console.groupEnd()
                    }
                })
            })

        return () => {
            VoxeetSDK.current.conference.leave()
                .then(() => console.log("left conference"))
        }
    }, [router.isReady, router.query])

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
                <div className={styles.mic}>
                { mute ?
                    <Image
                        onClick={handleMute}
                        width={28}
                        height={28}
                        src="/mic-muted.svg" alt="Muted mic" />
                      :
                    <Image
                        onClick={handleMute}
                        width={28}
                        height={28}
                        src="/mic-listening.svg" alt="Open mic" />
                }
                </div>
                <MicStatus mute={mute} status={status} />
            </div>
            }
        </div>
    )
}

export default Watch
