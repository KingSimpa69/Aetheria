import styles from "@/styles/market.module.css"
import ImageLoader from "../ImageLoader"

const WalletItem = ({item,}) => {
    return(
        <div key={item.id} className={styles.item}>
            <div className={styles.itemImage}><ImageLoader alt={"item#"+item.id} src={item.image_url} width={195} height={195} /></div>
            <div className={styles.walletItemButton}>
                MANAGE
            </div>
        </div>
    )
}

export default WalletItem