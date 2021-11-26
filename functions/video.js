export const togglePlay = (vid) => {
    const method = vid.paused ? "play" : "pause"
    vid[method]()
}

export const updateToggle = (vid, button) => {
    button.textContent = vid.paused ? "▶︎" : "॥" 
}

export const updateVolume = (e, vid, setVolume, setAudio) => {
    vid.volume = e.currentTarget.value
    setVolume(e.currentTarget.value)

    if (e.currentTarget.value === "0") {
        setAudio(false)
    } else {
        setAudio(true)
    }

    const value = (e.currentTarget.value - e.currentTarget.min)/(e.currentTarget.max - e.currentTarget.min)*100
    e.currentTarget.style.background = 'linear-gradient(to right, #fff 0%, #fff ' + value + '%, #696969 ' + value + '%, #696969 100%)';
}

export const updateProgress = (vid, bar, setTime) => {
    const percent = (vid.currentTime/vid.duration)*100
    setTime(formatTime(vid.currentTime))
    bar.style.width = `${percent}%`
}

export const seek = (e, vid) => {
    const seekTime = (e.clientX / e.currentTarget.offsetWidth)*vid.duration
    vid.currentTime = seekTime
}

export const formatTime = (sec) => {
    sec = Math.round(sec)
    const hours = Math.floor(sec / 3600)
    const minDivisor = sec % 3600
    const mins = Math.floor(minDivisor / 60)
    const secDivisor = minDivisor % 60
    let seconds = Math.ceil(secDivisor)

    if (hours === 0) {
        seconds = seconds >= 10 ? seconds : "0" + seconds 
        return mins+":"+seconds
    } else {
        seconds = seconds >= 10 ? seconds : "0" + seconds 
        return hours+":"+mins+":"+seconds
    }
}

export const noAudio = (vid, setAudio, setVolume, ref) => {
    if (vid.volume > 0) {
        setAudio(false)
        vid.volume = 0
        setVolume(0)
        ref.style.background = 'linear-gradient(to right, #fff 0%, #fff ' + 0 + '%, #696969 ' + 0 + '%, #696969 100%)';
    } else {
        setAudio(true)
        vid.volume = 1
        setVolume(1)
        ref.style.background = 'linear-gradient(to right, #fff 0%, #fff ' + 100 + '%, #696969 ' + 100 + '%, #696969 100%)';
    }
} 

export const handleFullscreen = (ref) => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        ref.requestFullscreen()
    }
}

export const handleMouseMovement = (ref, controls) => {
    const timer = ref.getAttribute("timer")
    if (timer) {
        clearTimeout(timer)
        ref.setAttribute("timer", "")
        controls.style.visibility = "visible" 
    }
    const t = setTimeout(() => {
        ref.setAttribute("timer", "")
        document.body.style.cursor = "none";
        controls.style.visibility = "hidden" 
    }, 3500)

    ref.setAttribute("timer", t)
    document.body.style.cursor = "default";
    controls.style.visibility = "visible" 
}


