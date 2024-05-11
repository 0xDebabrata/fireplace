import React, { useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Toaster } from 'react-hot-toast'

const UploadButton = ({ flag, setFlag }) => {
  const supabase = createClientComponentClient()
  const fileInput = useRef(null)

  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleClick = () => {
    fileInput.current.click()
  }

  const updateDb = async (videoId, fileName) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from("fireplace-videos")
      .insert([{
        id: videoId,
        name: fileName,
        url: `https://d3v6emoc2mddy2.cloudfront.net/${user.id}/${videoId}/${fileName}`,
        user_id: user.id
      }])
    if (error) {
      console.error(error)
      throw error
    }
  }

  const handleFileSelect = async () => {
    setUploadProgress(0)
    setLoading(true)

    const file = fileInput.current.files[0]
    const videoId = window.crypto.randomUUID()
    const { data: { user } } = await supabase.auth.getUser()

    const reqObject = {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        videoId: videoId,
        fileName: file.name,
        fileType: file.type
      })
    }

    const promise = new Promise(async (resolve, reject) => {
      const url = await fetch("/api/preSignedURL", reqObject)
        .then(resp => resp.json())
        .then(url => { return url.url })

      const xhr = new XMLHttpRequest()

      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            await updateDb(videoId, file.name)
            resolve(xhr)
            setFlag(!flag)
          } else {
            reject(xhr)
          }
        }
      }

      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total * 100).toFixed(2)
          setUploadProgress(percentComplete)
        }
      }

      xhr.open("PUT", url)
      xhr.send(file)
    })
      .then(() => {
        setUploadProgress(0)
        setLoading(false)
      })
  }

  return (
    <div 
      className={`${loading ? 'bg-neutral-800' : 'bg-neutral-700 hover:bg-neutral-600 cursor-pointer'} relative py-2 w-28 rounded flex justify-center items-center text-sm duration-200`}
      onClick={handleClick}
    >
      {loading
        ? (<div className=''>
            <p className='text-neutral-200'>Uploading</p>
            <div className='bg-neutral-500 h-0.5 absolute bottom-0 inset-x-0 rounded-b'>
              <div style={{ width: `${uploadProgress}%`}} className={`bg-yellow-600 h-0.5 ${uploadProgress === "100" ? 'rounded-b' : 'rounded-bl'}`}>
              </div>
            </div>
          </div>)
        : <p className='text-neutral-200'>Upload video</p>
      }
      <input 
        onChange={handleFileSelect}
        type="file" accept="video/mp4,video/webm,video/ogg" hidden 
        ref={fileInput}
      />
      <Toaster
        toastOptions={{
          style: {
            minWidth: "300px"
          }
        }} 
      />
    </div>
  )
}

export default UploadButton
