import { useRef } from 'react'
import styles from '../styles/Participants.module.css'

const Participants = () => {

    const colours = ["B7C3FF", "FFD1B7", "E5B7FF", "D0D0D0", "D3FFC9"]

    return(
        <div className={styles.container}>
            <div id="avatarsWrapper" className={styles.wrapper}>
            </div>
        </div>
    )
}

export default Participants
