import styles from "@/styles/market.module.css"
import formatETH from "@/functions/formatETH"
import { formatUnits,parseEther } from "viem"
import { useState } from "react"
import { readContract, writeContract } from "@wagmi/core";
import { publicClient } from "@/components/Web3/Web3Modal";
import ABI from "@/functions/contracts/ABI.json"
import HorizontalRule from "@/components/HorizontalRule";

const Liquidity = ({marketInfo,alert,setIsLoading}) => {

    const [addAmount,setAddAmount] = useState("")

    const handleInput = (event) => {
        let value = event.target.value;
        value = value.replace(/[^\d.]/g, "");
        if (value.toString().length > 5) {
          value = value.slice(0, 6);
        } else if (value > 1000) {
          value = 1000;
        }
        setAddAmount(value.toString());
      };
    
      const addLiquidity = async () => {
        try {
        const data = await writeContract({
            abi: ABI.market,
            address: marketInfo[2],
            functionName: "addLiquidity",
            args: [],
            value:parseEther(addAmount)
          });
          setIsLoading(true);
          const confirmation = await publicClient.waitForTransactionReceipt({
            hash: data.hash,
            confirmations: 3,
          });
          if (confirmation.status === "success") {
            alert("success","Liquidity added",data.hash)
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
                <h1>Add Liquidity</h1>
                <input onChange={(e)=>handleInput(e)} value={addAmount} type="text" placeholder={`0.001`}/>
                <div onClick={()=>{addAmount.length > 0 && parseFloat(addAmount) !== 0 ? addLiquidity() : null}} className={addAmount.length > 0 && parseFloat(addAmount) !== 0 ? styles.adminUpdateButton : styles.adminUpdateButtonDisabled}>Add</div>
            </div>
            <HorizontalRule />
            <div className={styles.adminItemCont}>
                <h1>Withdraw Liquidity</h1>
                <div className={styles.liqStatus}>{formatETH(formatUnits(marketInfo[4].lp,18))} ETH</div>
                <div className={styles.adminUpdateButtonDisabled}>Withdraw</div>
            </div>
            <HorizontalRule />
            <div className={styles.adminItemCont}>
                <h1>Unwrap WETH</h1>
                <div className={styles.liqStatus}>0 WETH</div>
                <div className={styles.adminUpdateButtonDisabled}>Unwrap</div>
            </div>
        </>
    )
}

export default Liquidity