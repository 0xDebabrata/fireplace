import styles from "../../styles/Chat.module.css"

const ChatMessage = ({ messageObj }) => {
    return (
        <div 
            style={messageObj.sent ? {
                marginLeft: "auto",
                marginRight: "5px",
            } : {
                marginBottom: "15px"
            }}>
            <p>{messageObj.message}</p>
            {!messageObj.sent && (
                <p 
                    style={{
                        color: "#ffffff90",
                    }}
                    className={styles.nickname}>{messageObj.nickname}</p>
            )}
        </div>
    )
}

export default ChatMessage
