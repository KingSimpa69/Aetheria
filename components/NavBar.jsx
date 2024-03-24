import styles from "@/styles/navbar.module.css"
import Web3Status from "./Web3/Web3Status"
import SearchBar from "./SearchBar"
import Link from "next/link"

const NavBar = ({router,setWeb3Shit,web3Shit,config,setIsLoading,isFocused,setIsFocused,width}) => {

    return(
        <div className={styles.navbar}>
            <div className={width < 900 && isFocused ? ` hidden` : styles.navBarOuterEdges}>
                <h1><Link href={'/'}>Aetheria</Link></h1>
            </div>
            <SearchBar width={width} isFocused={isFocused} setIsFocused={setIsFocused} setIsLoading={setIsLoading} web3Shit={web3Shit}/>
            <Web3Status width={width} isFocused={isFocused} router={router} config={config} web3Shit={web3Shit} setWeb3Shit={setWeb3Shit} />
        </div>
    )
}

export default NavBar