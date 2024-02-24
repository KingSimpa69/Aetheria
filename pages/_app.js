import "@/styles/globals.css";
import 'animate.css';
import { useState, useEffect } from "react";
import AetheriaGlow from "@/components/AetheriaGlow";
import HeadMeta from "@/components/HeadMeta";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
const { library, config } = require('@fortawesome/fontawesome-svg-core');
import { faTwitter, faGithub, faDiscord, faLinkedin, faXTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faCopy} from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faWallet, faStore, faTag, faXmark, faInfo, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Web3Modal } from "@/components/Web3/Web3Modal";
import Alert from "@/components/Alert";
library.add(faWallet,faStore,faMagnifyingGlass,faTag,faXmark,faInfo,faThumbsUp)
config.autoAddCss = false;

export default function App({ Component, pageProps }) {

  const [web3Shit, setWeb3Shit] = useState({chain: 0, address: undefined, isConnected: false})
  const router = useRouter();
  const [alerts,setAlerts] = useState([])

  const alert = (type,message,tx) => {
    setAlerts(alerts=>[...alerts,{
      type:type,
      message:message,
      tx:tx
    }])
  }

  useEffect(() => {
    web3Shit.chain !== 0 ? console.log(web3Shit) : null
  }, [web3Shit])  

  return (
    <Web3Modal>
      <HeadMeta />
      <Alert alerts={alerts} setAlerts={setAlerts} />
      <AetheriaGlow />
      <NavBar config={config} router={router} web3Shit={web3Shit} setWeb3Shit={setWeb3Shit}/>
      <Component router={router} web3Shit={web3Shit} {...pageProps} alert={alert} />
    </Web3Modal>
  )

}