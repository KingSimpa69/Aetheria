import styles from '@/styles/navbar.module.css'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect } from 'react'
import { useChainId, useAccount } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Web3Status = ({router,setWeb3Shit,web3Shit,isFocused,width}) => {

    const chainId = useChainId()
    const {address, isConnected} = useAccount()
    const { open } = useWeb3Modal()
  
    useEffect(() => {
        if (web3Shit.chain !== chainId || web3Shit.address !== address || web3Shit.isConnected !== isConnected) {
            setWeb3Shit({ chain: chainId, address: address, isConnected: isConnected })
        }
    }, [address, isConnected, chainId, setWeb3Shit, web3Shit])

    return(
        <div className={width < 900 && isFocused ? `hidden` : styles.navBarOuterEdges}>
            {!web3Shit.isConnected ? <FontAwesomeIcon icon="fa-solid fa-wallet" onClick={() => open({view:'Connect'})} />:
            <FontAwesomeIcon icon="fa-solid fa-wallet" onClick={() => open({ view: 'Account' })} />}
        </div>
    )
}

export default Web3Status