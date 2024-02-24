import styles from "@/styles/market.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ViewSwitcher = ({view, setView}) => {
    return(
        <div className={`flexRow ${styles.viewSwitcher}`}>
            <div onClick={()=>setView("market")} className={view === "market" ? styles.viewActive : null}><FontAwesomeIcon icon="fa-solid fa-store" /></div>
            <div onClick={()=>setView("wallet")} className={view === "wallet" ? styles.viewActive : null}><FontAwesomeIcon icon="fa-solid fa-wallet" /></div>
        </div>
    )
}

export default ViewSwitcher