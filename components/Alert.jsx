import style from "@/styles/alert.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shortenEthAddy } from "@/functions/shortenEthAddy";
import BLOCKSCOUT from "@/blockscout.json"

const Alert = ({ alerts, setAlerts, web3Shit }) => {
  const [exitAnimationIndexes, setExitAnimationIndexes] = useState([]);

  useEffect(() => {
    const animationTimeouts = [];

    alerts.forEach((alert, index) => {
      const timeoutId = setTimeout(() => {
        setExitAnimationIndexes(prevIndexes => [...prevIndexes, index]);
      }, 3500 * (index + 1));
      animationTimeouts.push(timeoutId);
    });

    return () => {
      animationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [alerts]);

  const handleAnimationEnd = index => {
    setExitAnimationIndexes(prevIndexes =>
      prevIndexes.filter(item => item !== index)
    );
    setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
  };

  return (
    <div className={style.wrapper}>
      {alerts.map((alert, index) => (
        <a key={index} href={`${BLOCKSCOUT[web3Shit.chain]}tx/${encodeURI(alert.tx)}`} target="_blank">
        <div
          className={`${style.container} ${style[alert.type]} ${
            exitAnimationIndexes.includes(index)
              ? "animate__animated animate__fadeOutLeft"
              : ""
          }`}
          onAnimationEnd={() => handleAnimationEnd(index)}
        >
          <div className={style.baseLogo}>
            {alert.type === "success" && alert.tx !== undefined && (
              <Image alt={'base-logo'} src={"/images/base50.png"} width={50} height={50} />
            )}
            {alert.type === "success" && alert.tx === undefined && (
              <FontAwesomeIcon icon="fa-solid fa-thumbs-up" />
            )}
            {alert.type === "error" && (
              <FontAwesomeIcon icon="fa-solid fa-xmark" />
            )}
            {alert.type === "info" && (
              <FontAwesomeIcon icon="fa-solid fa-info" />
            )}
          </div>
          <div className={style.alertInfo}>
            <h1>{alert.message}</h1>
            {alert.type === "success" && alert.tx !== undefined && (
              <>
                <p>3 confirmations</p>
                <p>{shortenEthAddy(alert.tx)}</p>
              </>
            )}
          </div>
        </div>
        </a>
      ))}
    </div>
  );
};

export default Alert;
