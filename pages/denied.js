import { useRouter } from 'next/router'

import styles from "../styles/Denied.module.css"

const Denied = () => {
    
    const router = useRouter()

    const handleClick = () => {
        router.push("/")
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h2>Could not join watchparty 😔</h2>
                <p>Fireplace currently supports a maximum of 5 participants in a watchparty</p>
                <button
                    onClick={handleClick}
                    className={styles.button}
                >
                    Go Home
                </button>

            </div>
        </div>
    )
}

export default Denied
