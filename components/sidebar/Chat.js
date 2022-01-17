import { useEffect, useState } from "react"
import Image from "next/image"
import ChatMessage from "./ChatMessage"

import styles from "../../styles/Chat.module.css"

const Chat = ({ messageList, setMessageList }) => {

    const [message, setMessage] = useState("")

    const addMessage = (e) => {
        e.preventDefault()
        if (!message) return;

        setMessageList(oldArr => {
            return [...oldArr, {
                message: message,
                sent: true 
            }]
        })

        setMessage("")
    }

    // Auto scroll to bottom of chat whenever new message is added
    useEffect(() => {
        const chat = document.getElementById("chat")
        chat.scrollTop = chat.scrollHeight
    }, [messageList])

    return (
        <div className={styles.container}> 
            <div id="chat"
                className={styles.chat}
            >
                {messageList.map((messageObj, index) => (
                    <ChatMessage message={messageObj.message} sent={messageObj.sent} key={index} />
                ))}
            </div>
            <form className={styles.inputWrapper} onSubmit={addMessage}>
                <input 
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    type="text"
                    placeholder="Enter message" />
                <button
                    type="submit"
                    className={styles.sendIcon}>
                    <Image src="/arrow-icon.svg"
                        alt="Send message icon"
                        width={28} height={28} 
                    />
                </button>
            </form>
        </div>
    )
}

export default Chat
