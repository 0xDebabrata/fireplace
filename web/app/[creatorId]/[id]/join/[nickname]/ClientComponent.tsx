"use client";

import { useEffect, useRef, useState } from "react";
//import { useRouter } from 'next/navigation'
import toast, { Toaster } from "react-hot-toast";
import WebSocket from "isomorphic-ws";
import { Session } from "@supabase/supabase-js";

import VideoPlayer from "../../../../../components/VideoPlayer";
import Loader from "../../../../../components/Loading";
import Sidebar from "../../../../../components/sidebar/Sidebar";
import { updatePlayhead, keepAlive } from "../../../../../functions/watchparty";

import styles from "../../../../../styles/Watch.module.css";

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
  const [messageList, setMessageList] = useState<any[]>([
            {
              type: "event",
              message: "Video paused",
            },
  ]);
  // Track web socket connection status.
  // Optimistically set to true initially.
  const [wsConnected, setWsConnected] = useState(true);
  // Time to wait for before re-establishing connection
  const [waitTime, setWaitTime] = useState(1); // 1 sec
  const [showSidebar, setShowSidebar] = useState(true);
  const [unreadIndicator, setUnreadIndicator] = useState(false);

  const sleep = async (time: number) => {
    return new Promise((res) => {
      setTimeout(res, time);
    });
  };
  const reconnect = async (wait: number) => {
    console.log("Reconnecting");
    if (wsConnected) return;

    console.log("before");
    await sleep(wait);
    console.log("after");
    setWaitTime(2 * waitTime);
    setupWsConnection();
  };

  const setupWsConnection = () => {
    const { id, nickname } = params;
    const clientId = session.user.id;

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

      setWsConnected(true);
      setWaitTime(1);
    };

    ws.current.onerror = (error: WebSocketEventMap["error"]) => {
      console.error("onerror", error);
    };
    ws.current.onclose = (event: WebSocketEventMap["close"]) => {
      console.log("onclose", event);
      if (!event.wasClean) {
        setWsConnected(false);
        // Try to re-establish connection
        reconnect(waitTime);
      }
    };

    ws.current.onmessage = (message) => {
      const response = JSON.parse(message.data);
      const vid = document.getElementById("video") as HTMLVideoElement;

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
          setAutoplay(true);
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
        setMessageList((oldArr) => {
          return [
            ...oldArr,
            {
              type: "event",
              message: `${response.nickname} joined`,
            },
          ];
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
        setMessageList((oldArr) => {
          return [
            ...oldArr,
            {
              type: "event",
              message: `${response.nickname} left`,
            },
          ];
        });
      }

      if (response.method === "play") {
        if (!creator) {
          vid.play();
        }
        setMessageList((oldArr) => {
          return [
            ...oldArr,
            {
              type: "event",
              message: "Video playing",
            },
          ];
        });
      }

      if (response.method === "pause") {
        if (!creator) {
          vid.pause();
        }
        setMessageList((oldArr) => {
          return [
            ...oldArr,
            {
              type: "event",
              message: "Video paused",
            },
          ];
        });
      }

      if (response.method === "seeked") {
        vid.currentTime = response.playhead;
        setMessageList((oldArr) => {
          return [
            ...oldArr,
            {
              type: "event",
              message: "Video seeked",
            },
          ];
        });
      }

      if (response.method === "chat") {
        setMessageList((oldArr) => {
          return [
            ...oldArr,
            {
              type: "message",
              message: response.message,
              sent: false,
              nickname: response.nickname,
            },
          ];
        });
      }
    };
  };

  useEffect(() => {
    if (!showSidebar) {
      setUnreadIndicator(true);
    }
  }, [messageList]);

  useEffect(() => {
    let creator = false;

    const { creatorId, id } = params;
    setPartyId(id);

    if (creatorId === session.user.id) {
      creator = true;
      setCreator(true);
      setCreatorUserId(creatorId);
    }

    setupWsConnection();

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
                unreadIndicator={unreadIndicator}
                setUnreadIndicator={setUnreadIndicator}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
              />
            ) : (
              <VideoPlayer
                src={videoSrc}
                controls={false}
                playheadStart={playheadStart}
                screenRef={screenRef}
                partyId=""
                creatorId=""
                ws={null}
                autoplay={autoplay}
                unreadIndicator={unreadIndicator}
                setUnreadIndicator={setUnreadIndicator}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
              />
            )}

            {showSidebar && (
              <Sidebar
                session={session}
                ws={ws}
                partyId={partyId}
                messageList={messageList}
                setMessageList={setMessageList}
                wsConnected={wsConnected}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
              />
            )}
          </div>
        )}
      </div>

      <Toaster
        toastOptions={{
          style: {
            minWidth: "300px",
          },
        }}
      />
    </>
  );
}
