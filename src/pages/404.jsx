// Styles
import styles from '../styles/pages/404.module.css'


/**
 * Component renders the `404 not found` page.
 */
function PageNotFound() {

    return (
        <div className={styles["PageNotFound"]}>
            <img src="/imgs/404.png" alt="404 - page not found" />
        </div>
    )
}

export default PageNotFound