'use client'

import { useEffect, useRef, useState } from "react"
//import { useRouter } from 'next/navigation'
import toast, { Toaster } from "react-hot-toast"
import WebSocket from "isomorphic-ws";
import { Session } from "@supabase/supabase-js"

import VideoPlayer from "../../../../../components/VideoPlayer";
import Loader from "../../../../../components/Loading";
import Sidebar from "../../../../../components/sidebar/Sidebar";
import { updatePlayhead, keepAlive } from "../../../../../functions/watchparty";

import styles from "../../../../../styles/Watch.module.css"

interface ClientProps {
  params: {
    creatorId: string;
    id: string;
    nickname: string;
  };
  session: Session;
}

export default function ClientComponent({ params, session }: ClientProps) {
  //const router = useRouter()

  const ws = useRef<WebSocket | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);

  const [autoplay, setAutoplay] = useState(false);
  const [creatorUserId, setCreatorUserId] = useState<string | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [creator, setCreator] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playheadStart, setPlayheadStart] = useState(0);
  const [denied, setDenied] = useState(true);
  const [messageList, setMessageList] = useState<any[]>([]);

  useEffect(() => {
    const clientId = session.user.id;
    let creator = false

    const { creatorId, id, nickname } = params;
    setPartyId(id);

    if (creatorId === session.user.id) {
      creator = true
      setCreator(true);
      setCreatorUserId(creatorId);
    }

    ws.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?userId=${clientId}&partyId=${id}`
    );

    ws.current.onopen = () => {
      // Send join watchparty request to server
      const payload = {
        method: "join",
        clientId: clientId,
        nickname: decodeURIComponent(nickname),
        partyId: id,
      };
      ws.current?.send(JSON.stringify(payload));
    };

    ws.current.onmessage = (message) => {
      const response = JSON.parse(message.data);
      const vid = document.getElementById("video") as HTMLVideoElement

      /*
      // Max participant limit reached
      if (response.method === "denied") {
        router.push("/denied");
        setDenied(true);
      }
      */

      if (response.method === "join") {
        setVideoSrc(response.party.src);
        setLoading(false);
        setPlayheadStart(response.party.playhead);
        setDenied(false);

        // Start playback if owner's video is playing
        // This helps auto start the client's video if they join mid-stream.
        if (response.party.isPlaying) {
          setAutoplay(true)
        }

        if (creator) {
          const partyId = response.party.id;
          updatePlayhead(partyId, ws);
        } else {
          keepAlive(clientId, ws);
        }
      }

      // New user joined watchparty
      if (response.method === "new") {
        toast(`${response.nickname} joined!`, {
          icon: "✌️",
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }

      // A user left the watchparty
      if (response.method === "leave") {
        toast(`${response.nickname} left!`, {
          icon: "👋",
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }

      if (response.method === "play") {
        if (!creator) {
          vid.play();
        }
      }

      if (response.method === "pause") {
        if (!creator) {
          vid.pause();
        }
      }

      if (response.method === "seeked") {
        vid.currentTime = response.playhead;
      }

      if (response.method === "chat") {
        setMessageList((oldArr) => {
          return [
            ...oldArr,
            {
              message: response.message,
              sent: false,
              nickname: response.nickname,
            },
          ];
        });
      }
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <Loader loading={loading} />
        ) : (
          <div ref={screenRef} className={styles.container}>
            {creator ? (
              <VideoPlayer
                src={videoSrc}
                controls={true}
                partyId={partyId}
                creatorId={creatorUserId}
                ws={ws}
                playheadStart={playheadStart}
                screenRef={screenRef}
                autoplay={autoplay}
              />
            ) : (
              <VideoPlayer
                src={videoSrc}
                controls={false}
                playheadStart={playheadStart}
                screenRef={screenRef}
                partyId=''
                creatorId=''
                ws={null}
                autoplay={autoplay}
              />
            )}

            <Sidebar
              session={session}
              ws={ws}
              partyId={partyId}
              messageList={messageList}
              setMessageList={setMessageList}
            />
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

