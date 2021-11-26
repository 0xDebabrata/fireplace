import styles from "../styles/Status.module.css"

const MicStatus = ({ mute, status }) => {
    if (mute) {
        return (
            <div className={styles.muted} />
        )
    } else {
        if (status === "listening") {
            return (
                <div className={styles.listening} />
            )
        } else if (status ==="speaking") {
            return (
                <div className={styles.speaking} />
            )
        }
    }

    return null
}

export default MicStatus

