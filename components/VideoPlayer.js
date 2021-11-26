import styles from "../styles/VideoPlayer.module.css"

import {useRef, useEffect, useState} from "react"
import Image from "next/image"

import { handleMouseMovement, noAudio, handleFullscreen, formatTime, seek, togglePlay, updateProgress, updateToggle, updateVolume } from '../functions/video'
import { handlePause, handlePlay, handleSeeked, loadStartPosition } from '../functions/watchparty'

const VideoPlayer = ({ src, controls, partyId, creatorId, ws, playheadStart, screenRef }) => {

    const videoRef = useRef()
    const toggleRef = useRef()
    const progressRef = useRef()
    const containerRef = useRef()
    const volumeRef = useRef()
    const controlsRef = useRef()

    const [volume, setVolume] = useState(1)
    const [time, setTime] = useState()
    const [duration, setDuration] = useState()
    const [audio, setAudio] = useState(true)

    useEffect(() => {
        if (!videoRef.current) return
        setTime(formatTime(videoRef.current.currentTime))
    }, [])

    return (
        <div ref={containerRef} 
            onMouseMove={() => handleMouseMovement(containerRef.current, controlsRef.current)}
            className={styles.player}>
            <video 
                id="video"
                onPlay={() => {
                    if (controls) handlePlay(partyId, creatorId, ws)
                    updateToggle(videoRef.current, toggleRef.current)
                }}
                onPause={() =>  {
                    if (controls) handlePause(partyId, creatorId, ws)
                    updateToggle(videoRef.current, toggleRef.current)
                }}
                onSeeked={() => {
                    if (controls) handleSeeked(partyId, creatorId, ws)
                }}
                onTimeUpdate={() => updateProgress(videoRef.current, progressRef.current, setTime)}
                onLoadedMetadata={() => {
                    loadStartPosition(playheadStart)
                    setDuration(formatTime(videoRef.current.duration))
                }}
                ref={videoRef}
                onClick={() => togglePlay(videoRef.current)}
                className={styles.viewer} 
                src={src} />
            <div className={styles.controls} ref={controlsRef}>
                <div 
                    onClick={(e) => {
                        controls ?
                        seek(e, videoRef.current)
                        : 
                            null
                    }}
                    className={styles.progress}>
                    <div 
                        ref={progressRef} 
                        className={styles.progressFilled} />
                </div>
        {controls &&
                <button 
                    ref={toggleRef}
                    onClick={() => togglePlay(videoRef.current)}
                    className={styles.toggle}>
                    ▶︎
                </button>
                }
                {time && duration && 
                    <p>{time} / {duration}</p>
                }
                <div className={styles.audio}>
                    <Image src={audio ? "/audio.png" : "/no-audio.png"}
                        onClick={() => noAudio(videoRef.current, setAudio, setVolume, volumeRef.current)}
                        width={24} height={24} alt="audio icon" />
                </div>
                <input 
                    type="range" min="0" max="1" step="0.01"
                    value={volume} ref={volumeRef}
                    name="volume"
                    className={styles.slider}
                    onChange={(e) => updateVolume(e, videoRef.current, setVolume, setAudio)}
                />
                <div className={styles.fullscreen}>
                    <Image src="/fullscreen.png" 
                        onClick={() => handleFullscreen(screenRef.current)}
                        alt="fullscreen icon"
                        width={24} height={24} />
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer

