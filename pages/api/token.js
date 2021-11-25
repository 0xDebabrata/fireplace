export default async function handler(req, res) {
    const authHeader = "Basic " + Buffer.from(encodeURI(process.env.DOLBY_CONSUMER_KEY) + ":" + encodeURI(process.env.DOLBY_CONSUMER_SECRET)).toString("base64")
    const tokenUrl = "https://session.voxeet.com/v1/oauth2/token"

    const params = {
        method: "POST",
        headers: { 
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": authHeader 
        },
        body: `grant_type=client_credentials&expires_in=${7200}` 
    }

    // Get access token from Dolby
    return fetch(tokenUrl, params)
        .then(data => data.json())
        .then(result => {
            const accessToken = result.access_token
            res.status(200).json({ accessToken })  //Send token to client 
        })
}
