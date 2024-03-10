import styles from "@/styles/navbar.module.css"
import Web3Status from "./Web3/Web3Status"
import SearchBar from "./SearchBar"
import Link from "next/link"

const NavBar = ({router,setWeb3Shit,web3Shit,config,setIsLoading}) => {

    return(
        <div className={styles.navbar}>
            <div className={styles.navBarOuterEdges}>
                <h1><Link href={'/'}>Aetheria</Link></h1>
            </div>
            <SearchBar setIsLoading={setIsLoading} web3Shit={web3Shit}/>
            <Web3Status router={router} config={config} web3Shit={web3Shit} setWeb3Shit={setWeb3Shit} />
        </div>
    )
}

export default NavBar