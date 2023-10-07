import React, {useEffect, useState} from 'react'
import { supabase } from '../utils/supabaseClient'

import Loader from "./Loading"
import Card from './Card'

const Files = ({ flag }) => {

    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState(null)

    const getFiles = async () => {
        const { data, error } = await supabase
            .from("fireplace-videos")
            .select("*")

        setVideos(data)
        setLoading(false)
    }

    useEffect(() => {
        getFiles()
    }, [flag])

     return (
         <div>
             {loading ? <Loader loading={loading} /> :
                 videos ?
                     videos.map((video, index) => {
                         return <Card key={index} name={video.name} url={video.url} video={video} list={videos} setVideos={setVideos} />
                     }) :
                     <p className="text-neutral-200 onboarding">Upload a video to get started!</p>
             }
         </div>
     )
}

export default Files
