// Get video signed URL and send create request to server
export const createWatchparty = async (id, clientId, supabase, ws, WebSocket, setConnected) => {
    const { data: watchparties, error } = await supabase
        .from("watchparties")
        .select("video_url")
        .eq("id", id)

    if (!error) {

        ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/${clientId}`)

        const payload = {
            "method": "create",
            "partyId": id,
            "src": watchparties[0].video_url,
            "clientId": clientId
        }

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify(payload))
            console.log("create request sent")
            setConnected(true)
        }

    } else {
        console.log(error)
        alert("There was a problem")
    }
}

export const handleClick = (nickname, creatorId, id, toast, router) => {
    if (!nickname) {
        // toast alert
        toast.error("Please enter a nickname")
    } else {
        // Join watchparty
        router.push({
            pathname: '/[creatorId]/[id]/join/[nickname]',
            query: {
                creatorId: creatorId,
                id: id,
                nickname: nickname
            }
        })
    }
}

export const copyLink = (toast) => {
    const link = document.querySelector("#link")
    link.select()
    document.execCommand("copy")
    toast.success("Link copied successfully!")
}
