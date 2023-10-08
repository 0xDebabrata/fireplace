'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useEffect } from 'react'

const images = [
  "https://film-grab.com/wp-content/uploads/photo-gallery/58%20(259).jpg?bwg=1547209454",
  "https://film-grab.com/wp-content/uploads/photo-gallery/35%20(293).jpg?bwg=1547209454",
  "https://film-grab.com/wp-content/uploads/photo-gallery/42%20(507).jpg?bwg=1547222787",
  "https://film-grab.com/wp-content/uploads/photo-gallery/29%20(513).jpg?bwg=1547222787",
  "https://film-grab.com/wp-content/uploads/photo-gallery/32%20(512).jpg?bwg=1547222787",
  "https://film-grab.com/wp-content/uploads/photo-gallery/dunkirk044.jpg?bwg=1551283900",
  "https://film-grab.com/wp-content/uploads/photo-gallery/dunkirk015.jpg?bwg=1551283900",
  "https://film-grab.com/wp-content/uploads/photo-gallery/Dune_2021_002.jpg?bwg=1642501569",
  "https://film-grab.com/wp-content/uploads/photo-gallery/03%20(334).jpg?bwg=1547211992",
  "https://film-grab.com/wp-content/uploads/photo-gallery/Dune_2021_009.jpg?bwg=1642501569"
]

const Login = () => {
  const supabase = createClientComponentClient()

  const login = async (provider) => {
    await supabase.auth.signInWithOAuth({ 
      provider, 
      options : {
        redirectTo: `${location.origin}/auth/callback`,
      }
    })
    //router.refresh()
  }

  useEffect(() => {
    const getSession = async () => {
      console.log(await supabase.auth.getSession())
    }
    getSession()
  }, [])

  return (
    <div className="flex h-screen flex-1 bg-neutral-900">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Image
              className='-translate-x-6'
              src="/Logo.png"
              alt="fireplace logo"
              height={75}
              width={240}
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-300">
              Sign in to your account
            </h2>
          </div>

          <div> 
            <div className="mt-10 space-y-5">
              <button
                onClick={() => login("google")}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-neutral-100 hover:bg-neutral-200 py-1.5 text-black duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                </svg>
                Login with Google
              </button>

              <button
                onClick={() => login("discord")}
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#5865f2]/90 hover:bg-[#5865f2] py-1.5 text-white duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-discord" viewBox="0 0 16 16">
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                </svg>
                Login with Discord
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={images[Math.floor(Math.random() * 1000) % images.length]}
          alt="aesthetic movie image"
        />
      </div>
    </div>
  )
}

export default Login
