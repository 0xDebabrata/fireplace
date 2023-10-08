'use client'

import { useEffect, useState } from "react"

interface ChatMessage {
  text: string;
  self: boolean;
  nickname: string;
}

export default function ChatWindow () {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    let timer1, timer2, timer3
    timer1 = setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Welcome!",
        self: true,
        nickname: ""
      }])
    }, 5000);
    timer2 = setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Let the show begin!",
        self: false,
        nickname: "Theo"
      }])
    }, 7500);
    timer3 = setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Finally!!",
        self: false,
        nickname: "Dan"
      }])
    }, 7000);

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="absolute z-10 right-0 bottom-0 p-3 w-[300px] h-[200px] flex flex-col justify-end items-end">
      {messages.map((message, key) => (
        <ChatBubble message={message} key={key} />
      ))}
    </div>
  )
}

const ChatBubble = ({ message }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <p className={`${message.self ? "ml-auto mr-0 bg-neutral-800" : "ml-0 mr-auto bg-neutral-600" } ${visible ? "opacity-100" : "opacity-0"} transition-all mt-1 py-2 px-4 inline-block text-white rounded-full`}>
        {message.text}
      </p>
      {
        !message.self && (
          <p className={`${visible ? "opacity-100" : "opacity-0"} text-neutral-300 text-xs ml-2 mt-1 mr-auto transition-all`}>
            {message.nickname}
          </p>
        )
      }
    </>
  )
}

