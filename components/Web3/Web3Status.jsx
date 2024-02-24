import styles from '@/styles/navbar.module.css'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect } from 'react'
import { useChainId, useAccount } from 'wagmi'
import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import Image from 'next/image';

const Web3Status = ({router,setWeb3Shit,web3Shit}) => {

    const chainId = useChainId()
    const {address, isConnected} = useAccount()
    const { open } = useWeb3Modal()
  
    useEffect(() => {
        if (web3Shit.chain !== chainId || web3Shit.address !== address || web3Shit.isConnected !== isConnected) {
            setWeb3Shit({ chain: chainId, address: address, isConnected: isConnected })
        }
    }, [address, isConnected, chainId, setWeb3Shit, web3Shit])

    return(
        <div className={styles.navBarOuterEdges}>
            {!web3Shit.isConnected ? <div onClick={() => open({view:'Connect'})} className={styles.connectBtn}>Connect</div>:
            <Image alt={"web3Avatar"} className={styles.connectedAvatar} height={35} width={35} src={generateAvatarURL(web3Shit.address === undefined ? "0x0000000000000000000000000000000000000000" : web3Shit.address)} onClick={() => open({ view: 'Account' })}/>}
        </div>
    )
}

export default Web3Status