import styles from "@/styles/market.module.css"
import { FACTORY_CONTRACT } from "@/functions/contracts"
import { writeContract } from '@wagmi/core'
import { publicClient } from "@/components/Web3/Web3Modal"
import { useState } from "react"

const Info = ({marketInfo,web3Shit,marketId,alert,setIsLoading}) => {
    
    const [regValues,setRegValues] = useState(["","","","","","",""])
    const [regChecks,setRegChecks] = useState([false,false,false,false,false,false,false])

    const modifyRegValues = (e,index) => {
        setRegValues(prev => {
            const updated = [...prev];
            updated[index] = e;
            return updated;
          });
    }

    const modifyRegChecks = (e,index) => {
        setRegChecks(prev => {
            const updated = [...prev];
            updated[index] = e;
            return updated;
          });
    }

    const handleRegEntry = async (value, target) => {
        const targets = ["name", "description", "website", "x", "discord", "telegram", "github"];
        const targetIndex = targets.indexOf(target);
        if (targetIndex !== -1) {
            modifyRegValues(value, targetIndex);
            modifyRegChecks(value !== "", targetIndex);
        }
    };

    const handleUpload = async (event, type) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
            setIsLoading(true)
            const imageData = reader.result.replace(/^data:.+base64,/, '');
            try {
                const response = await fetch('/api/uploadimage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ imageData })
                });
                const data = await response.json();
                const tx = await writeContract({
                    ...FACTORY_CONTRACT[web3Shit.chain],
                    functionName: 'updateMarketData',
                    args: [marketId, data.imageUrl, type]
                });
                const confirmation = await publicClient.waitForTransactionReceipt({ hash: tx.hash, confirmations: 3 })
                if (confirmation.status === "success") {
                    alert("success", "Image Uploaded", tx.hash)
                    setIsLoading(false);
                } else {
                    console.log("Transaction was not successful");
                    alert("error", "Error Uploading Image")
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
                alert("error", "Error Uploading Image")
                console.error('Error uploading image:', error);
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const updateRegistry = async (key,value) => {
        try{
            setIsLoading(true)
            const tx = await writeContract({
                ...FACTORY_CONTRACT[web3Shit.chain],
                functionName: 'updateMarketData',
                args: [marketId, value, key]
            });
            const confirmation = await publicClient.waitForTransactionReceipt({ hash: tx.hash, confirmations: 3 })
            if (confirmation.status === "success") {
                alert("success", `${key} Updated`, tx.hash)
                setIsLoading(false);
            } else {
                console.log("Transaction was not successful");
                alert("error", `Error updating ${key}`)
                setIsLoading(false);
            }
        } catch (e) {
            alert("error", `Error updating ${key}`)
            setIsLoading(false);
            console.error("Error updating the registry:",e)
        }
    }

    return(
        <>
            <div className={styles.adminItemCont}>
                <h1>Logo</h1>
                <label className={styles.imageUploadButton}>
                    <input id="logoFileInput" onChange={(event) => handleUpload(event, "logo")} type="file" accept="image/*"/>
                        <div>{marketInfo.logo}</div>
                        <button onClick={() => document.getElementById('logoFileInput').click()}>
                            Browse
                        </button>
                </label>
            </div>
            <div className={styles.adminItemCont}>
                <h1>Cover</h1>
                <label className={styles.imageUploadButton}>
                    <input onChange={(event) => handleUpload(event, "cover")} id="coverFileInput" type="file" accept="image/*"/>
                        <div>{marketInfo.cover}</div>
                        <button onClick={() => document.getElementById('coverFileInput').click()}>
                            Browse
                        </button>
                </label>
            </div>
            <div className={styles.adminItemCont}>
                <h1>Name</h1>
                <input placeholder={marketInfo.name === "" ? "Project Name" : marketInfo.name} value={regValues[0]} onChange={(e)=>handleRegEntry(e.target.value,"name")} type="text" />
                <div onClick={()=>updateRegistry("name",regValues[0])} className={styles.adminUpdateButton}>Update</div>
            </div>
            <div className={styles.adminItemCont}>
                <h1>Website</h1>
                <input placeholder={marketInfo.website === "" ? "website.com" : marketInfo.website} value={regValues[2]} onChange={(e)=>handleRegEntry(e.target.value,"website")} type="text" />
                <div onClick={()=>updateRegistry("website",regValues[2])} className={styles.adminUpdateButton}>Update</div>
            </div>
            <div className={styles.adminItemCont}>
                <h1>X</h1>
                <input placeholder={marketInfo.x === "" ? "x.com/elonmusk" : marketInfo.x} value={regValues[3]} onChange={(e)=>handleRegEntry(e.target.value,"x")} type="text" />
                <div onClick={()=>updateRegistry("x",regValues[3])} className={styles.adminUpdateButton}>Update</div>
            </div>
            <div className={styles.adminItemCont}>
                <h1>Discord</h1>
                <input placeholder={marketInfo.discord === "" ? "discord.com/invite/EVk2Zk2N3z" : marketInfo.discord} value={regValues[4]} onChange={(e)=>handleRegEntry(e.target.value,"discord")} type="text" />
                <div onClick={()=>updateRegistry("discord",regValues[4])} className={styles.adminUpdateButton}>Update</div>
            </div>
            <div className={styles.adminItemCont}>
                <h1>Telegram</h1>
                <input placeholder={marketInfo.telegram === "" ? "t.me/example" : marketInfo.telegram} value={regValues[5]} onChange={(e)=>handleRegEntry(e.target.value,"telegram")} type="text" />
                <div onClick={()=>updateRegistry("telegram",regValues[5])} className={styles.adminUpdateButton}>Update</div>
            </div>
            <div className={styles.adminItemCont}>
                <h1>Github</h1>
                <input placeholder={marketInfo.github === "" ? "github.com/kingsimpa69" : marketInfo.github} value={regValues[6]} onChange={(e)=>handleRegEntry(e.target.value,"github")} type="text" />
                <div onClick={()=>updateRegistry("github",regValues[6])} className={styles.adminUpdateButton}>Update</div>
            </div>
            <div className={styles.adminItemContBig}>
                <div className={styles.adminItemContBigRow}>                        
                    <h1>Description</h1>
                    <textarea placeholder={marketInfo.description === "" ? "Detailed paragraph about the project." : marketInfo.description} value={regValues[1]} onChange={(e)=>handleRegEntry(e.target.value,"description")} type="text" />
                </div>
                <div onClick={()=>updateRegistry("description",regValues[1])} className={styles.adminUpdateButton}>Update</div>
            </div>
        </>
    )
}

export default Info