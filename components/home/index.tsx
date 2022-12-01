import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

import ChatWindow from "./Chat"
import { handleMouseMovement, togglePlay } from '../../functions/video'
import { handlePause, handleSeeked } from '../../functions/watchparty'

export default function Home() {

  // Show participant joining toast
  useEffect(() => {
    setTimeout(() => {
      toast("Dan joined", {
        duration: 2000,
        position: "top-right",
        icon: "👋",
        style: {
          backgroundColor: "rgb(39 39 42)",
          color: "white"
        }
      })
      setTimeout(() => {
        toast("Theo joined", {
          duration: 2000,
          position: "top-right",
          icon: "👋",
          style: {
            backgroundColor: "rgb(39 39 42)",
            color: "white"
          }
        })
      }, 1500)
    }, 2000)
  }, [])

  return (
    <div className="w-full h-[100vh] bg-black">
      <VideoPlayer
        />
    </div>
  )
}

const VideoPlayer = () => {
  const src = "https://sorxybcoqgcofqmjysrg.supabase.co/storage/v1/object/public/assets/Mars.mp4?t=2022-11-29T17%3A25%3A51.704Z"
  const partyId = 123
  const creatorId = 123
  const ws = { current: { send: () => {} } }

  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const controlsRef = useRef(null)

  return (
    <div ref={containerRef} 
      onMouseMove={() => handleMouseMovement(containerRef.current, controlsRef.current)}
      id="video-player"
      className="relative overflow-hidden">
      <video 
        id="video"
        autoPlay
        muted
        loop
        src={src}
        onPlay={() => handlePause(partyId, creatorId, ws)}
        onPause={() => handlePause(partyId, creatorId, ws)}
        onSeeked={() => handleSeeked(partyId, creatorId, ws)}
        ref={videoRef}
        onClick={() => togglePlay(videoRef.current)}
        className="z-0 w-full h-auto"
      />
      <div ref={controlsRef}>
      </div>

      <ChatWindow />
    </div>
  )
}
