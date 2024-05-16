import styles from "../styles/VideoPlayer.module.css";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  PlayIcon,
  PauseIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/solid";

import {
  handleMouseMovement,
  noAudio,
  handleFullscreen,
  formatTime,
  seek,
  togglePlay,
  updateProgress,
  updateVolume,
} from "../functions/video";
import {
  handlePause,
  handlePlay,
  handleSeeked,
  loadStartPosition,
} from "../functions/watchparty";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

const VideoPlayer = ({
  autoplay,
  src,
  name,
  controls,
  partyId,
  creatorId,
  ws,
  playheadStart,
  screenRef,
  unreadIndicator,
  setUnreadIndicator,
  showSidebar,
  setShowSidebar,
}) => {
  const videoRef = useRef();
  const progressRef = useRef();
  const containerRef = useRef();
  const volumeRef = useRef();
  const controlsRef = useRef();
  const subtitleBtnRef = useRef();

  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState();
  const [duration, setDuration] = useState();
  const [audio, setAudio] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [subtitleURL, setSubtitleURL] = useState("");
  const [showChat, setShowChat] = useState(true);

  const getSubtitleSrc = () => {
    const subsArr = src.split(".");
    subsArr.splice(-1, 1, "vtt");
    const subtitleURL = subsArr.join(".");
    console.log("SUBS", subtitleURL);
    return subtitleURL;
  };

  const hideSubtitles = () => {
    videoRef.current.textTracks[0].mode = "hidden";
  };

  const toggleSubtitles = () => {
    if (videoRef.current.textTracks[0].mode === "hidden") {
      videoRef.current.textTracks[0].mode = "showing";
      subtitleBtnRef.current.setAttribute("data-state", "active");
    } else {
      videoRef.current.textTracks[0].mode = "hidden";
      subtitleBtnRef.current.setAttribute("data-state", "hidden");
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    setTime(formatTime(videoRef.current.currentTime));
    hideSubtitles();
    setSubtitleURL(getSubtitleSrc());
  }, [videoRef.current]);

  return (
    <div
      ref={containerRef}
      onMouseMove={() =>
        handleMouseMovement(containerRef.current, controlsRef.current)
      }
      id="video-player"
      className={styles.player}
    >
      <video
        id="video"
        crossOrigin="anonymous"
        onPlay={() => {
          setIsPaused(videoRef.current.paused);
          if (controls) {
            handlePlay(partyId, creatorId, ws);
          }
        }}
        onPause={() => {
          setIsPaused(videoRef.current.paused);
          if (controls) {
            handlePause(partyId, creatorId, ws);
          }
        }}
        onSeeked={() => {
          if (controls) {
            handleSeeked(partyId, creatorId, ws);
          }
        }}
        onTimeUpdate={() =>
          updateProgress(videoRef.current, progressRef.current, setTime)
        }
        onLoadedMetadata={() => {
          loadStartPosition(playheadStart);
          setDuration(formatTime(videoRef.current.duration));
          hideSubtitles();
        }}
        ref={videoRef}
        className={styles.viewer}
        src={src}
        autoPlay={autoplay}
      >
        <track
          label="English"
          kind="subtitles"
          srcLang="en"
          src={subtitleURL}
          default
        />
      </video>
      <div className="" ref={controlsRef}>
        <div
          className="absolute inset-x-0 top-20"
        >
          <p style={{ fontSize: "24px" }} className="text-2xl text-white drop-shadow-md">
            {name}
          </p>
        </div>
        <div
          className="absolute flex justify-center items-center top-0 bottom-0 left-0 right-0"
          onClick={() => {
            if (controls) {
              togglePlay(videoRef.current);
            }
          }}
        >
          {isPaused ? (
            <PlayIcon className="h-20 w-20 text-white" />
          ) : controls ? (
            <PauseIcon className="h-20 w-20 text-white" />
          ) : null}
        </div>
        <div
          onClick={(e) => {
            controls ? seek(e, videoRef.current) : null;
          }}
          className={styles.progress}
        >
          <div ref={progressRef} className={styles.progressFilled} />
        </div>
        {controls && (
          <div
            className="absolute bottom-4 left-3"
            onClick={() => togglePlay(videoRef.current)}
          >
            {isPaused ? (
              <PlayIcon className="h-6 w-6 text-white" />
            ) : (
              <PauseIcon className="h-6 w-6 text-white" />
            )}
          </div>
        )}
        {time && duration && (
          <p>
            {time} / {duration}
          </p>
        )}
        <div className={styles.audio}>
          <Image
            src={audio ? "/audio.png" : "/no-audio.png"}
            onClick={() =>
              noAudio(videoRef.current, setAudio, setVolume, volumeRef.current)
            }
            width={24}
            height={24}
            alt="audio icon"
          />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          ref={volumeRef}
          name="volume"
          className={styles.slider}
          onChange={(e) =>
            updateVolume(e, videoRef.current, setVolume, setAudio)
          }
        />
        <button
          ref={subtitleBtnRef}
          data-state="hidden"
          onClick={toggleSubtitles}
          className={styles.subtitle}
        >
          CC
        </button>

        <div className={styles.fullscreen}>
          <Image
            src="/fullscreen.png"
            onClick={() => handleFullscreen(screenRef.current)}
            alt="fullscreen icon"
            width={24}
            height={24}
          />
        </div>
      </div>
      <button
        onClick={() => {
          if (!showSidebar) {
            setUnreadIndicator(false);
            setShowSidebar(true);
          } else {
            setShowSidebar(false);
          }
        }}
        className="absolute top-4 right-4"
      >
        {!showSidebar ? (
          unreadIndicator ? (
            <ChatBubbleOvalLeftIcon
              className="text-orange-400 hover:text-orange-300"
              width={30}
            />
          ) : (
            <ChatBubbleOvalLeftIcon
              className="text-neutral-700 hover:text-neutral-500 duration-150 drop-shadow-xl"
              width={30}
            />
          )
        ) : (
          <></>
        )}
      </button>
    </div>
  );
};

export default VideoPlayer;
