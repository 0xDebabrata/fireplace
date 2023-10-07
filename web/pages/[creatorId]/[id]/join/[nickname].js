import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import WebSocket from "isomorphic-ws";
import { supabase } from "../../../../utils/supabaseClient";
import toast from "react-hot-toast";

import VideoPlayer from "../../../../components/VideoPlayer";
import Loader from "../../../../components/Loading";
import Sidebar from "../../../../components/sidebar/Sidebar";

import {
  updatePlayhead,
  keepAlive,
} from "../../../../functions/watchparty";

import styles from "../../../../styles/Watch.module.css";

const Watch = () => {
  const ws = useRef();
  const screenRef = useRef();

  const [creatorUserId, setCreatorUserId] = useState(null);
  const [partyId, setPartyId] = useState(null);
  const [creator, setCreator] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playheadStart, setPlayheadStart] = useState(0);
  const [denied, setDenied] = useState(true);
  const [messageList, setMessageList] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const clientId = supabase.auth.user().id;
    let creator = false

    if (!clientId) {
      alert("You need to be logged in");
      return;
    }

    if (router.isReady) {
      const { creatorId, id, nickname } = router.query;
      setPartyId(id);

      if (supabase.auth.session()) {
        if (creatorId === supabase.auth.user().id) {
          creator = true
          setCreator(true);
          setCreatorUserId(creatorId);
        }
      }

      ws.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?userId=${clientId}&partyId=${id}`
      );

      ws.current.onopen = () => {
        // Send join watchparty request to server
        const payload = {
          method: "join",
          clientId: clientId,
          nickname: nickname,
          partyId: id,
        };
        ws.current.send(JSON.stringify(payload));
      };

      ws.current.onmessage = (message) => {
        const response = JSON.parse(message.data);
        const vid = document.getElementById("video");

        // Max participant limit reached
        if (response.method === "denied") {
          router.push("/denied");
          setDenied(true);
        }

        if (response.method === "join") {
          setVideoSrc(response.party.src);
          setLoading(false);
          setPlayheadStart(response.party.playhead);
          setDenied(false);

          const partyId = response.party.id;

          if (creator) {
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
      };

    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [router.isReady, router.query]);

  useEffect(() => {
  }, [creator]);

  return (
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
              status={status}
            />
          ) : (
            <VideoPlayer
              src={videoSrc}
              controls={false}
              playheadStart={playheadStart}
              screenRef={screenRef}
              status={status}
            />
          )}

          <Sidebar
            ws={ws}
            partyId={partyId}
            messageList={messageList}
            setMessageList={setMessageList}
          />
        </div>
      )}
    </div>
  );
};

export default Watch;
