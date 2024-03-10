import styles from "@/styles/market.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ViewSwitcher = ({view, setView,owner,web3Shit}) => {
    
    return(
        <div className={`flexRow ${styles.viewSwitcher}`}>
            <div onClick={()=>setView("market")} className={view === "market" ? styles.viewActive : null}><FontAwesomeIcon icon="fa-solid fa-store" /></div>
            <div onClick={()=>setView("wallet")} className={view === "wallet" ? styles.viewActive : null}><FontAwesomeIcon icon="fa-solid fa-wallet" /></div>
            {web3Shit.address && owner && web3Shit.address.toString().toLowerCase() === owner.toString().toLowerCase() && <div onClick={()=>setView("admin")} className={view === "admin" ? styles.viewActive : null}><FontAwesomeIcon icon="fa-solid fa-sliders" /></div>}
        </div>
    )
}

export default ViewSwitcher