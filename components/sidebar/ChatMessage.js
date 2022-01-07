import styles from "../../styles/Chat.module.css"

const ChatMessage = ({ message, sent }) => {
    return (
        <div 
            style={sent? {
                marginLeft: "auto",
                marginRight: "5px"
            } : null}>
            <p>{message}</p>
        </div>
    )
}

export default ChatMessage
