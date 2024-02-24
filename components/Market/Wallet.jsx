import styles from "@/styles/market.module.css";
import { useState,useEffect } from "react";
import { isAddress } from "viem";
import BLOCKSCOUT from "@/blockscout.json"
import WalletItem from "./WalletItem";

const Wallet = ({marketInfo,web3Shit,setIsLoading,toggleManageModal,setSpotlight,owned,setOwned}) => {



    useEffect(() => {
        const pullOwned = async () => {
            try {
                let uniqueToken = null;
                let owned = [];
                do {
                    const result = await fetch(`${BLOCKSCOUT[web3Shit.chain]}/api/v2/tokens/${marketInfo[1]}/instances?holder_address_hash=${web3Shit.address}${uniqueToken ? `&unique_token=${uniqueToken}` : ''}`);
                    const formatted = await result.json();
                    owned = owned.concat(formatted.items);
                    uniqueToken = formatted.next_page_params?.unique_token;
                } while (uniqueToken !== undefined);
                //console.log(owned)
                setOwned(owned);
                setIsLoading(false)
            } catch (error) {
                console.log(error);
            }
        };
        marketInfo[1] && isAddress(web3Shit.address) && pullOwned();
        marketInfo[1] && !isAddress(web3Shit.address) && setIsLoading(false);
    }, [marketInfo,web3Shit,setIsLoading]);


    return(
        isAddress(web3Shit.address) ? <div className={`flexRow ${styles.itemCont}`}>
        {owned.map((e,index)=>{
            return(
                <div onClick={()=>{setSpotlight(e); toggleManageModal(true)}} key={index}>
                    <WalletItem item={e} />
                </div>
            )
        })}
        </div> :
        <div className={styles.notFound}>Please connect a wallet!</div>
    )
}

export default Wallet