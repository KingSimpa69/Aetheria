import styles from "@/styles/market.module.css";
import Stat from "./Stat";
import ImageLoader from "../ImageLoader";
import { useState, useEffect } from "react";
import ABI from "@/functions/contracts/ABI.json";
import { readContract, writeContract } from "@wagmi/core";
import { isAddress } from "viem";
import { publicClient } from "../Web3/Web3Modal";
import delay from "@/functions/delay";
import { parseEther, formatEther } from "viem";
import formatETH from "@/functions/formatETH";

const ManageModal = ({
  manageModal,
  toggleManageModal,
  spotlight,
  marketInfo,
  setIsLoading,
  setSpotlight,
  listed,
  setListed,
  owned,
  setOwned,
  alert
}) => {
  const [approved, setApproved] = useState(false);
  const [css0, setCss0] = useState("");
  const [css1, setCss1] = useState("hidden");
  const [subView, setSubView] = useState("list");
  const [listingPrice, setListingPrice] = useState("");
  const [liqVal, setLiqVal] = useState("");

  const handleInput = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d.]/g, "");
    if (value.toString().length > 5) {
      value = value.slice(0, 6);
    } else if (value > 1000) {
      value = 1000;
    }
    setListingPrice(value.toString());
  };

  const getListed = async () => {
    const data = await readContract({
      abi: ABI.market,
      address: marketInfo[2],
      functionName: "getListedTokens",
    });
    //console.log(data)
    setListed(data);
  };

  const getNftValue = async () => {
    const data = await readContract({
      abi: ABI.market,
      address: marketInfo[2],
      functionName: "itemValue",
    });
    setLiqVal(data);
  };

  const list = async () => {
    try {
      const data = await writeContract({
        abi: ABI.market,
        address: marketInfo[2],
        functionName: "list",
        args: [spotlight.id, parseEther(listingPrice)],
      });
      setIsLoading(true);
      const confirmation = await publicClient.waitForTransactionReceipt({
        hash: data.hash,
        confirmations: 3,
      });
      if (confirmation.status === "success") {
        setIsLoading(false);
        alert("success","Transaction Confirmed",data.hash)
        setListingPrice("");
        setSubView("attrib");
        getListed();
      } else {
        console.log("Transaction was not successful");
        alert("error","Error")
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("error","Error")
    }
  };

  const delist = async () => {
    try {
      const data = await writeContract({
        abi: ABI.market,
        address: marketInfo[2],
        functionName: "delist",
        args: [spotlight.id],
      });
      setIsLoading(true);
      const confirmation = await publicClient.waitForTransactionReceipt({
        hash: data.hash,
        confirmations: 3,
      });
      if (confirmation.status === "success") {
        setIsLoading(false);
        alert("success","Transaction Confirmed",data.hash)
        getListed();
      } else {
        console.log("Transaction was not successful");
        alert("error","Error")
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("error","Error")
    }
  };

  const liquidate = async () => {
    try {
      const data = await writeContract({
        abi: ABI.market,
        address: marketInfo[2],
        functionName: "liquidate",
        args: [spotlight.id],
      });
      setIsLoading(true);
      const confirmation = await publicClient.waitForTransactionReceipt({
        hash: data.hash,
        confirmations: 3,
      });
      if (confirmation.status === "success") {
        setIsLoading(false);
        alert("success","Transaction Confirmed",data.hash)
        setListingPrice("");
        setSubView("attrib");
        setOwned(owned.filter((item) => item.id !== spotlight.id.toString()));
        getListed();
        toggleManageModal(false);
      } else {
        console.log("Transaction was not successful");
        alert("error","Error")
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("error","Error")
    }
  };

  const checkIfApproved = async () => {
    try {
      const data = await readContract({
        abi: ABI.erc721,
        address: marketInfo[1],
        functionName: "getApproved",
        args: [spotlight.id],
      });
      data === marketInfo[2] ? setApproved(true) : setApproved(false);
    } catch (error) {
      console.log(error);
      setApproved(false);
    }
  };

  const revokeItem = async () => {
    try {
      const data = await writeContract({
        abi: ABI.erc721,
        address: marketInfo[1],
        functionName: "approve",
        args: ["0x0000000000000000000000000000000000000000", spotlight.id],
      });
      setIsLoading(true);
      const confirmation = await publicClient.waitForTransactionReceipt({
        hash: data.hash,
        confirmations: 1,
      });
      if (confirmation.status === "success") {
        setIsLoading(false) 
        checkIfApproved();
        alert("success","Transaction Confirmed",data.hash)
      } else {
        console.log("Transaction was not successful");
        alert("error","Error")
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("error","Error")
    }
  };

  const approveItem = async () => {
    try {
      const data = await writeContract({
        abi: ABI.erc721,
        address: marketInfo[1],
        functionName: "approve",
        args: [marketInfo[2], spotlight.id],
      });
      setIsLoading(true);
      const confirmation = await publicClient.waitForTransactionReceipt({
        hash: data.hash,
        confirmations: 1,
      });
      if (confirmation.status === "success") {
        setIsLoading(false) 
        checkIfApproved();
        alert("success","Transaction Confirmed",data.hash)
      } else {
        console.log("Transaction was not successful");
        alert("error","Error")
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("error","Error")
    }
  };

  useEffect(() => {
    isAddress(marketInfo[1]) &&
      spotlight.image_url !== undefined &&
      checkIfApproved() &&
      getNftValue();
  }, [spotlight, checkIfApproved]);

  useEffect(() => {
    const closeModal = async () => {
      setCss0("animate__animated animate__bounceOutUp animate__fast");
      await delay(420);
      setCss1("hidden");
      setSubView("attrib");
      setSpotlight({});
    };
    const openModal = async () => {
      setCss1("modalWrapper");
      setCss0("animate__animated animate__bounceInDown animate__fast");
    };
    manageModal ? openModal() : closeModal();
  }, [manageModal]);

  return (
    spotlight.image_url !== undefined && (
      <div
        onClick={() => {
          toggleManageModal(!manageModal);
        }}
        className={`${styles[css1]} ${css0}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={styles.modalContainer}
        >
          <div className={styles.modalImage}>
            <ImageLoader
              alt={spotlight.id}
              src={spotlight.image_url}
              fill={true}
            />
          </div>
          <div className={`flexCol ${styles.statCol}`}>
            <Stat stat={"ID"} value={spotlight.id} />

            {subView === "attrib" ? (
              <div className={styles.attributes}>
                {spotlight.metadata?.attributes?.map((e, index) => {
                  return (
                    <div key={index} className={styles.attribute}>
                      <div>{e.trait_type}</div>
                      <div className={styles.traitValue}>{e.value}</div>
                    </div>
                  );
                })}
              </div>
            ) : subView === "list" ? (
              <div className={styles.attributes}>
                <input
                  value={listingPrice}
                  type={"text"}
                  placeholder={"Price"}
                  onChange={handleInput}
                />
                <div
                  onClick={() =>
                    listingPrice.length > 0 &&
                    parseFloat(listingPrice) !== 0 &&
                    list()
                  }
                  className={`${styles.etherButton} ${
                    listingPrice.length === 0 ||
                    listed.some(
                      (e) => parseInt(e) === parseInt(spotlight.id)
                    ) ||
                    parseFloat(listingPrice) === 0 ||
                    isNaN(listingPrice)
                      ? styles.disabledButton
                      : ""
                  }`}
                >
                  List
                </div>
                <div className={styles.infoStrip}>
                  {listed.some((e) => parseInt(e) === parseInt(spotlight.id))
                    ? "Already listed"
                    : listingPrice.length === 0 ||
                      listed.some(
                        (e) => parseInt(e) === parseInt(spotlight.id)
                      ) ||
                      parseFloat(listingPrice) === 0 ||
                      isNaN(listingPrice)
                    ? null
                    : `List #${spotlight?.id} for ${listingPrice} ETH`}
                </div>
              </div>
            ) : subView === "liq" ? (
              <div className={styles.attributes}>
                <div className={styles.infoStrip}>
                  Liquidate Item #{spotlight.id} for{" "}
                  {formatETH(formatEther(liqVal))} ETH
                </div>
                <div onClick={() => liquidate()} className={styles.etherButton}>
                  Liquidate
                </div>
                <div className={styles.krabbyPattyForumlar}>
                  lpEthBalance / (nftTotalSupply - nftsHeldByLp)
                </div>
              </div>
            ) : null}

            {approved ? (
              <div className={"flexRow"}>
                {listed.some((i) => parseInt(i) === parseInt(spotlight.id)) ? (
                  <div
                    onClick={() => delist()}
                    className={styles.thirdButton}
                    style={{ backgroundColor: "#588dbe" }}
                  >
                    Delist
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      subView === "list"
                        ? setSubView("attrib")
                        : setSubView("list")
                    }
                    className={styles.thirdButton}
                    style={{ backgroundColor: "#588dbe" }}
                  >
                    {subView === "list" ? "Cancel" : "List"}
                  </div>
                )}
                <div
                  onClick={() =>
                    subView === "liq" ? setSubView("attrib") : setSubView("liq")
                  }
                  className={styles.thirdButton}
                  style={{ backgroundColor: "#4572e3" }}
                >
                  {subView === "liq" ? "Cancel" : "Liquidate"}
                </div>
                <div
                  onClick={() => revokeItem()}
                  className={styles.thirdButton}
                  style={{ backgroundColor: "#eb4034" }}
                >
                  Revoke
                </div>
              </div>
            ) : (
              <div onClick={() => approveItem()} className={styles.buyButton}>
                Approve
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ManageModal;
