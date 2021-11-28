# Fireplace

Fireplace is an easy to use media playback service that lets you upload video content and create watchparties which can be enjoyed with friends and family anywhere around the world!

It's complete with user authentication, real time playback and voice chat. All you need to do is invite your friends and have a good time at Fireplace :)

[Here's a link to the working site](https://fireplace-debabratajr.vercel.app/).

[And here's a link to the server repo.](https://github.com/0xDebabrata/fireplace-server)


### How it works

1. When a user signs up, Fireplace sends a magic link using Supabase's authentication service.
2. All uploaded videos are stored in AWS S3.
3. Playback controls are synced in real time with the help of a websocket server.
4. Voice chat is enabled using Dolby's APIs. The voice chat features spatial audio, allowing multiple participants to be heard clearly even when speaking at the same time.

Vercel has been used to host the next.js app and AWS to deploy the websocket server.

### The process

The motivation for creating Fireplace came from wanting to watch videos with my friends in a seamless manner. The pandemic made it even more necessary to find new ways to connect with friends and relatives. Dolby provided a great opportunity in making this possible. 

From the get go I wanted to use websocket to sync the video streams, but implementing it was a challenge on it's own. Voice chat with spatial audio added a whole new interactive dimension.


### What's next?

Build the World hackathon has been fun and I'm excited to submit this version of Fireplace. However, I have plans to further improve the website.

1. Fireplace currently supports 5 participants at a watchparty. This can be increased in the future.
2. Improve the custom video player.
3. Improve website performance.

