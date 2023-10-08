'use client'

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import { Toaster } from 'react-hot-toast'
import { Session } from '@supabase/supabase-js'

import ChatWindow from "./Chat"
import { handleMouseMovement, togglePlay } from '../../functions/video'
import { handlePause, handleSeeked } from '../../functions/watchparty'

interface HomeProps {
  session: Session | null
}

export default function Home(props: HomeProps) {
  const {
    session
  } = props

  // Show participant joining toast
  useEffect(() => {
    let timer1, timer2
    timer1 = setTimeout(() => {
      toast("Dan joined", {
        duration: 3000,
        position: "top-right",
        icon: "👋",
        style: {
          backgroundColor: "rgb(39 39 42)",
          color: "white"
        }
      })
    }, 2000)
    timer2 = setTimeout(() => {
      toast("Theo joined", {
        duration: 2000,
        position: "top-right",
        icon: "👋",
        style: {
          backgroundColor: "rgb(39 39 42)",
          color: "white"
        }
      })
    }, 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="w-full h-[100vh] bg-black">
      <div className="mt-10 absolute z-10 w-full text-center pt-2">
        <Image
          className="mx-auto"
          src="/Logo.png"
          alt="fireplace logo"
          height={75}
          width={240}
        />
      </div>
      <VideoPlayer session={session} />
    </div>
  )
}

const VideoPlayer = ({ session }: HomeProps) => {
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
      <div className="z-20 w-full text-center absolute top-36">
        <h1 className="text-white text-4xl">
          experience cinema.
        </h1>
        <h2 className="text-white text-2xl mb-5">
          with friends.
        </h2>
        <Link href={session ? "/app" : "/login"}>
          <button className="px-5 text-sm py-1.5 border border-neutral-500 bg-neutral-500/40 text-neutral-200 rounded-full hover:border-neutral-400 hover:bg-neutral-500/60 duration-150 cursor-pointer">
            Start watching &rarr;
          </button>
        </Link>
      </div>
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
        className="z-0 w-auto h-screen mx-auto"
      />
      <div ref={controlsRef}>
      </div>
      <ChatWindow />

      <Toaster
        toastOptions={{
          style: {
          minWidth: "300px"
          }
        }} 
      />
    </div>
  )
}
