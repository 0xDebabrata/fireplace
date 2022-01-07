import styles from "../../styles/Chat.module.css"

const ChatMessage = ({ message, sent }) => {
    return (
        <div className={sent ? "sent" : null}>
            <p>{message}</p>
        </div>
    )
}

export default ChatMessage
