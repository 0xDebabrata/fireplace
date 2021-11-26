import styles from "../styles/VideoPlayer.module.css"

import {useRef, useEffect, useState} from "react"
import Image from "next/image"

import { handleMouseMovement, noAudio, handleFullscreen, formatTime, seek, togglePlay, updateProgress, updateToggle, updateVolume } from '../functions/video'

const VideoPlayer = () => {

    const videoRef = useRef()
    const toggleRef = useRef()
    const progressRef = useRef()
    const containerRef= useRef()
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
                onPlay={() => updateToggle(videoRef.current, toggleRef.current)}
                onPause={() => updateToggle(videoRef.current, toggleRef.current)}
                onTimeUpdate={() => updateProgress(videoRef.current, progressRef.current, setTime)}
                onLoadedMetadata={() => setDuration(formatTime(videoRef.current.duration))}
                ref={videoRef}
                onClick={() => togglePlay(videoRef.current)}
                className={styles.viewer} 
                src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" />
            <div className={styles.controls} ref={controlsRef}>
                <div 
                    onClick={(e) => seek(e, videoRef.current)}
                    className={styles.progress}>
                    <div 
                        ref={progressRef} 
                        className={styles.progressFilled} />
                </div>
                <button 
                    ref={toggleRef}
                    onClick={() => togglePlay(videoRef.current)}
                    className={styles.toggle}>
                    ▶︎
                </button>
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
                        onClick={() => handleFullscreen(containerRef.current)}
                        alt="fullscreen icon"
                        width={24} height={24} />
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer

