import styles from "@/styles/market.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

const SocialIcon = ({link,icon}) => {

    return(
        <Link href={link.startsWith("https://") ? link : "https://" + link} passHref target="_blank">
            <div className={styles.socialIcon}>
                <FontAwesomeIcon icon={icon} />
            </div>
        </Link>
    )
}

export default SocialIcon