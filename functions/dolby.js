// Callback passed to Voxeet initializer to get refreshed token
export const refreshToken = async () => {
    try {
        const response = await fetch("/api/token")
        const json = await response.json()
        console.log(json.accessToken)
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

        /*
        // Set default audio IO
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(async () => {
                sdk.mediaDevice.selectAudioInput("default")
                sdk.mediaDevice.selectAudioOutput("default")
                console.log("audio IO set")
            })
            */
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
        }
    }

    try {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(() => {
                // Create conference
                sdk.conference.create(conferenceOptions)
                    .then(conf => {
                        // Join the conference
                        sdk.conference.join(conf, joinOptions)
                        console.log("joined", conf.alias)
                    })
                    .catch(e => { console.error(e) })
            })
    } catch (e) { console.error(e) }


}
