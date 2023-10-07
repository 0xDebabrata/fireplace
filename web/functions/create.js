// Get video signed URL and send create request to server
export const createWatchparty = async (id, clientId, supabase, setLoading) => {
    const { data: watchparties, error } = await supabase
        .from("watchparties")
        .select("video_url")
        .eq("id", id)

    if (!error) {
        const src = watchparties[0].video_url
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/create?ownerId=${clientId}&partyId=${id}&src=${src}`, {
            method: 'GET'
        })
        setLoading(false)
    } else {
        console.log(error)
        throw error
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
