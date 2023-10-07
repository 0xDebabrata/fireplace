import { useEffect, useState } from "react"

export default function ChatWindow () {
  const [show, setShow] = useState(true)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Welcome!",
        self: true,
        nickname: ""
      }])
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "Let the show begin!",
          self: false,
          nickname: "Theo"
        }])
      }, 2500);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "Finally!!",
          self: false,
          nickname: "Dan"
        }])
      }, 2000);
    }, 6000);
  }, [])

  if (!show) {
    return null;
  }

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
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <>
      <p className={`${message.self ? "ml-auto mr-0 bg-neutral-800" : "ml-0 mr-auto bg-neutral-600" } ${visible ? "opacity-100" : "opacity-0"} transition-all py-2 px-4 inline-block ml-auto mr-0 text-white rounded-full`}>
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

