import styles from "../../styles/Chat.module.css"

const ChatMessage = ({ messageObj }) => {
    return (
        <div 
            className={styles.wrapper}
        >
            <div className={styles.message}
                style={messageObj.sent ? {
                    marginLeft: "auto",
                    marginRight: "5px",
                    backgroundColor: "#69696990"
                } : null }
            > 
                <p>{messageObj.message}</p>
            </div>
            {!messageObj.sent && (
                <div className={styles.nickname}>
                <p 
                    style={{
                        color: "#ffffff90",
                    }}
                >{messageObj.nickname}</p>
                </div>
            )}
        </div>
    )
}

export default ChatMessage
