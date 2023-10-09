import React, {useEffect, useState} from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../database.types'

import Loader from "./Loading"
import Card from './Card'

const Files = ({ flag }) => {
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<Database["public"]["Tables"]["fireplace-videos"]["Row"][] | null>([])

  useEffect(() => {
    const supabase = createClientComponentClient<Database>()

    const getFiles = async () => {
      const { data, error } = await supabase
        .from("fireplace-videos")
        .select("*")

      if (error) {
        console.error(error)
      } else {
        setVideos(data)
        setLoading(false)
      }
    }

    getFiles()
  }, [flag])

   return (
     <div className='py-5 bg-neutral-900'>
       {loading ? <Loader loading={loading} />
       : (videos && videos.length) ?
           videos.map((video, index) => {
             return <Card 
               key={index} 
               name={video.name} 
               url={video.url} 
               list={videos} 
               setVideos={setVideos} 
             />
           }) 
         :
         <>
           <p className="text-neutral-200 onboarding">Your library is empty.</p>
           <p className="text-neutral-200 text-center">Upload a video to create a watchparty.</p>
         </>
       }
     </div>
   )
}

export default Files
