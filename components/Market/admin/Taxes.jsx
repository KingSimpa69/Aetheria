import HorizontalRule from "@/components/HorizontalRule";
import styles from "@/styles/market.module.css"
import { useState, useEffect } from "react"
import { writeContract,readContract } from '@wagmi/core'
import { publicClient } from "@/components/Web3/Web3Modal"
import ABI from "@/functions/contracts/ABI.json"
import { isAddress } from "viem";

const Taxes = ({web3Shit,marketContract,setIsLoading,alert}) => {

    const [taxes,setTaxes] = useState(["","",""])
    const [addys,setAddys] = useState(["","",""])
    const [sanityCheck,setSanityCheck] = useState([false,false,false])
    const [currentTaxes,setCurrentTaxes] = useState([0,0,0])
    const [currentAddys,setCurrentAddys] = useState(["","",""])

    const fetchData = async (functionName, args) => {
        try {
            const result = await readContract({
                address: marketContract,
                abi: ABI.market,
                functionName: functionName,
                args: args
            });
            return result;
        } catch (error) {
            console.error(`Error fetching ${functionName}:`, error);
            return 0;
        }
    };
    
    const getTaxes = async () => {
        const taxesPromises = [0, 1, 2].map(async (index) => {
            return fetchData('tax', [index]);
        });
    
        const addysPromises = [0, 1, 2].map(async (index) => {
            return fetchData('addys', [index]);
        });
    
        const taxesResults = await Promise.all(taxesPromises);
        const addysResults = await Promise.all(addysPromises);
    
        setCurrentTaxes(taxesResults);
        setCurrentAddys(addysResults);
    };

    const handleEntry = async (value,target,target2) => {
        const isValidTax = /^(?:\d{1,2})?$/.test(value);
        if(target === "tax" && isValidTax){
            setTaxes(prev => {
                const updated = [...prev];
                updated[target2] = value;
                return updated;
              });
        }
        if(target === "addy"){
            setAddys(prev => {
                const updated = [...prev];
                updated[target2] = value;
                return updated;
              });
        }
    };

    const setSanity = (id,bool) => {
        setSanityCheck(prev => {
            const updated = [...prev];
            updated[id] = bool;
            return updated;
          });
    }

    const updateTax = async (tax) => {
        if (!isAddress(addys[tax]) && addys[tax] !== "") {
            alert("error", `Not a valid Ethereum address`)
            return
        }
        try{
            const address = addys[tax] === "" ? "0x0000000000000000000000000000000000000000" : addys[tax]
            const taxAmount = addys[tax] === "" ? 0 : taxes[tax]
            const tx = await writeContract({
                address:marketContract,
                abi: ABI.market,
                functionName: 'setTax',
                args: [tax, address, taxAmount]
            });
            const confirmation = await publicClient.waitForTransactionReceipt({ hash: tx.hash, confirmations: 3 })
            if (confirmation.status === "success") {
                alert("success", `Tax Updated`, tx.hash)
                setIsLoading(false);
            } else {
                console.log("Transaction was not successful");
                alert("error", `Error updating tax`)
                setIsLoading(false);
            }
        } catch (e) {
            alert("error", `Error updating tax`)
            setIsLoading(false);
            console.error("Error updating the registry:",e)
        }
    }

    useEffect(() => {
        getTaxes()
    }, [])
    

    useEffect(() => {
        addys[0] !== "" && !isAddress(addys[0]) ? setSanity(0,false) : setSanity(0,true)
        addys[1] !== "" && !isAddress(addys[1]) ? setSanity(1,false) : setSanity(1,true)
        addys[2] !== "" && !isAddress(addys[2]) ? setSanity(2,false) : setSanity(2,true)
    }, [taxes,addys])
    

    return(
        <>
            <div className={styles.taxNote}>Keeping the address field empty will set the tax to zero</div>
            <div className={styles.adminItemCont}>
                <h1>Tax 1</h1>
                <input value={taxes[0]} onChange={(e)=>handleEntry(e.target.value,"tax",0)} placeholder={currentTaxes[0]} type="text" />
                <input value={addys[0]} onChange={(e)=>handleEntry(e.target.value,"addy",0)} placeholder={currentAddys[0]} type="text" />
                <div onClick={()=> sanityCheck[0] ? updateTax(0) : null} className={sanityCheck[0] ? styles.adminUpdateButton : styles.adminUpdateButtonDisabled}>Update</div>
            </div>
            <HorizontalRule />
            <div className={styles.adminItemCont}>
                <h1>Tax 2</h1>
                <input value={taxes[1]} onChange={(e)=>handleEntry(e.target.value,"tax",1)} placeholder={currentTaxes[1]} type="text" />
                <input value={addys[1]} onChange={(e)=>handleEntry(e.target.value,"addy",1)} placeholder={currentAddys[1]} type="text" />
                <div onClick={()=> sanityCheck[1] ? updateTax(1) : null} className={sanityCheck[1] ? styles.adminUpdateButton : styles.adminUpdateButtonDisabled}>Update</div>
            </div>
            <HorizontalRule />
            <div className={styles.adminItemCont}>
                <h1>Tax 3</h1>
                <input value={taxes[2]} onChange={(e)=>handleEntry(e.target.value,"tax",2)} placeholder={currentTaxes[2]} type="text" />
                <input value={addys[2]} onChange={(e)=>handleEntry(e.target.value,"addy",2)} placeholder={currentAddys[2]} type="text" />
                <div onClick={()=> sanityCheck[2] ? updateTax(2) : null} className={sanityCheck[2] ? styles.adminUpdateButton : styles.adminUpdateButtonDisabled}>Update</div>
            </div>
        </>
    )
}

export default Taxes