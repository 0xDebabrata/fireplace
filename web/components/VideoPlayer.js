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
  const subtitleBtnRef = useRef()

  const [volume, setVolume] = useState(1)
  const [time, setTime] = useState()
  const [duration, setDuration] = useState()
  const [audio, setAudio] = useState(true)

  const subtitleSrc = () => {
    const arr = src.split(".")
    arr.splice(-1, 1, "vtt")
    return arr.join(".")
  }

  const hideSubtitles = () => {
    videoRef.current.textTracks[0].mode = "hidden"
  }

  const toggleSubtitles = () => {
    if (videoRef.current.textTracks[0].mode === "hidden") {
      videoRef.current.textTracks[0].mode = "showing"
      subtitleBtnRef.current.setAttribute("data-state", "active")
    } else {
      videoRef.current.textTracks[0].mode = "hidden"
      subtitleBtnRef.current.setAttribute("data-state", "hidden")
    }
  }

  useEffect(() => {
    if (!videoRef.current) return
    setTime(formatTime(videoRef.current.currentTime))
    hideSubtitles()
  }, [])

  return (
    <div ref={containerRef} 
      onMouseMove={() => handleMouseMovement(containerRef.current, controlsRef.current)}
      id="video-player"
      className={styles.player}>
      <video 
        id="video"
        crossOrigin="anonymous"
        onPlay={() => {
          if (controls) {
            handlePlay(partyId, creatorId, ws)
            updateToggle(videoRef.current, toggleRef.current)
          }
        }}
        onPause={() =>  {
          if (controls) {
            handlePause(partyId, creatorId, ws)
            updateToggle(videoRef.current, toggleRef.current)
          }
        }}
        onSeeked={() => {
          if (controls) {
            handleSeeked(partyId, creatorId, ws)
          }
        }}
        onTimeUpdate={() => updateProgress(videoRef.current, progressRef.current, setTime)}
        onLoadedMetadata={() => {
          loadStartPosition(playheadStart)
          setDuration(formatTime(videoRef.current.duration))
          hideSubtitles()
        }}
        ref={videoRef}
        onClick={() => {
          if (controls) {
            togglePlay(videoRef.current)
          }
        }}
        className={styles.viewer} 
        src={src}
      >
        <track 
          label="English"
          kind="subtitles"
          srcLang="en"
          src={subtitleSrc()}
          default
        />
      </video>
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
        <button 
          ref={subtitleBtnRef}
          data-state="hidden"
          onClick={toggleSubtitles}
          className={styles.subtitle}>
          CC
        </button>

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

