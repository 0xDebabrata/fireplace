import { useEffect, useState } from "react"
import Image from "next/image"
import ChatMessage from "./ChatMessage"

import styles from "../../styles/Chat.module.css"

const Chat = ({ messageList, setMessageList }) => {

    const [message, setMessage] = useState("")

    const addMessage = () => {
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
            <div className={styles.inputWrapper}>
                <input 
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    type="text"
                    placeholder="Enter message" />
                <div 
                    onClick={addMessage}
                    className={styles.sendIcon}>
                    <Image src="/arrow-icon.svg"
                        alt="Send message icon"
                        width={28} height={28} 
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat
