import styles from "@/styles/market.module.css"
import { useState } from "react"
import { isAddress } from "viem"
import { writeContract } from "@wagmi/core";
import { publicClient } from "@/components/Web3/Web3Modal";
import ABI from "@/functions/contracts/ABI.json"

const Ownership = ({owner,marketInfo,alert,setIsLoading}) => {

    const [addy,setAddy] = useState("")

    const handleInput = (value) => {
        setAddy(value.toString());
    };

    const transferOwnership = async () => {
        try {
            const address = addy === "" ? "0x0000000000000000000000000000000000000000" : addy
        const data = await writeContract({
            abi: ABI.market,
            address: marketInfo[2],
            functionName: "transferOwnership",
            args: [address]
          });
          setIsLoading(true);
          const confirmation = await publicClient.waitForTransactionReceipt({
            hash: data.hash,
            confirmations: 3,
          });
          if (confirmation.status === "success") {
            alert("success","Ownership Transferred!",data.hash)
            setIsLoading(false);
          }
          console.log(data)
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        alert("error","Error")
      }
    }    

    return(
        <>
            <div className={styles.adminItemCont}>
                <h1>Transfer Ownership</h1>
                <input onChange={(e)=>handleInput(e.target.value)} value={addy} type="text" placeholder={owner}/>
                <div 
                onClick={()=>{isAddress(addy) ? transferOwnership() : null}} 
                className={isAddress(addy) ? styles.adminUpdateButton : styles.adminUpdateButtonDisabled}>Transfer</div>
            </div>
        </>
    )
}

export default Ownership