import styles from "@/styles/navbar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Web3Status from "./Web3/Web3Status"

const NavBar = ({router,setWeb3Shit,web3Shit,config}) => {

    return(
        <div className={styles.navbar}>
            <div className={styles.navBarOuterEdges}>
                <h1>Aetheria</h1>
            </div>
            <div className={styles.searchBar}>
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                <input placeholder={'Search for NFT smart contract'} type={'text'}/>
            </div>
            <Web3Status router={router} config={config} web3Shit={web3Shit} setWeb3Shit={setWeb3Shit} />
        </div>
    )
}

export default NavBar