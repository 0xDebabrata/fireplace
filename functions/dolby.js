// Callback passed to Voxeet initializer to get refreshed token
export const refreshToken = async () => {
    return fetch("/api/token")
        .then(resp => resp.json())
        .then(data => data.accessToken)
}
