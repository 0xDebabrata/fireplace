// Callback passed to Voxeet initializer to get refreshed token
export const getAccessToken = async () => {
    try {
        const response = await fetch("/api/token")
        const json = await response.json()
        return json.accessToken
    } catch (e) { console.log(e) }
}

// Get audio devices
export const getAudioIO = async (sdk) => {
    try {
        // Load output devices
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(async () => {
                const audioOutput = await sdk.mediaDevice.enumerateAudioDevices("output")
                console.log("Output devices:")
                console.log(audioOutput)

                // Load input devices
                const audioInput = await sdk.mediaDevice.enumerateAudioDevices("input")
                console.log("Input devices:")
                console.log(audioInput)

                return {
                    inputDevices: audioInput,
                    outputDevices: audioOutput
                }
            })
    } catch (error) { console.log(error) }
}

// Open session and set default IO
export const openSession = async (sdk, nickname) => {
    try {
        // Open session
        sdk.session.open({ name: nickname })
        console.log("session open")

    } catch (e) { console.log(e) }
}

// Create and join conference
export const joinConference = async (sdk, partyId) => {
    const conferenceOptions = {
        alias: partyId,
        params: {
            dolbyVoice: true
        }
    }

    const joinOptions = {
        constraints: {
            audio: true,
            video: false
        },
        preferRecvMono: false,
        spatialAudio: true
    }

    try {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(() => {
                // Create conference
                sdk.conference.create(conferenceOptions)
                    .then(conf => {
                        // Join the conference
                        sdk.conference.join(conf, joinOptions)
                        setSpatialEnvironment(sdk)
                        return conf
                    })
            })
    } catch (e) { console.error(e) }
}

// Set spatial audio scene
export const setSpatialEnvironment = (sdk) => {
    const scale = {
        x: document.documentElement.clientWidth / 4,
        y: document.documentElement.clientHeight / 3,
        z: 1
    }

    const forward = { x: 0, y: -1, z: 0 }
    const up = { x:0, y: 0, z: 1 }
    const right = { x: 1, y: 0, z: 0 }

    sdk.conference.setSpatialEnvironment(scale, forward, up, right)
}

export const setSpatialPosition = (sdk, participant) => {
    console.log(sdk.conference.participants())
}
