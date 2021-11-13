export default function handler(req, res) {
    const authHeader = "Basic " + Buffer.from(encodeURI(process.env.DOLBY_CONSUMER_KEY) + ":" + encodeURI(process.env.DOLBY_CONSUMER_SECRET)).toString("base64")
    const tokenUrl = "https://session.voxeet.com/v1/oauth2/token"
    const params = {
        method: "POST",
        headers: { Authorization: authHeader },
        body: {
            grant_type: "client_credentials",
            expires_in: 10800
        }
    }

    // Get access token from Dolby
    fetch(tokenUrl, params)
        .then(data => data.json())
        .then(result => {
            console.log("token sent")
            const accessToken = result.access_token
            res.status(200).json({ accessToken })  //Send token to client 
        })
}
