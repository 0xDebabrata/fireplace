// Callback passed to Voxeet initializer to get refreshed token
export const refreshToken = async () => {
    return fetch("/api/token")
        .then(resp => resp.json())
        .then(data => data.accessToken)
}

// Get audio devices
export const getAudioIO = async (sdk, nickname) => {
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
