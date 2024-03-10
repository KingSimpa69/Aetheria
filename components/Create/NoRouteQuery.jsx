import styles from "@/styles/create.module.css"
import HorizontalRule from "../HorizontalRule"

const NoRouteQuery = () => {

    return(
        <div className={styles.container}>
            <div className={styles.header}>Something's not right</div>
            <HorizontalRule />
            <div className={styles.checkParams}>Please ensure that you have entered a VALID NFT CONTRACT in the URL.</div>
            <div className={styles.checkParams}>for example:</div>
            <div className={styles.checkParams} style={{marginTop:"15px",color:"var(--buttonColor)",fontSize:"12px"}}>aetheria.market/create/0x91164C6e24CCbDFB82141Ca9EeC4EDaaE22d2114</div>
        </div>
    )
}

export default NoRouteQuery