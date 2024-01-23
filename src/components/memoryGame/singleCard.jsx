import { easy, easy_hebrew, hard, hard_hebrew } from '../../difficulty/WordDifficulty'
// Utils
import { GetModuleStylesGetter } from '../../utils/styles.util'
// Styles
import styles from '../../styles/components/single-card.module.css'

/**
 * Styles getter shorthand.
 */
const getStyles = GetModuleStylesGetter(styles)

/**
 * Component renders the Memory game : single card component.
 */
export default function SingleCard({ card, handleChoice, flipped }) {
    // Handlers
    function handleClick() {
        // Function handles the user choice.
        handleChoice(card)
    }

    return (
        <div className={getStyles(`card ${flipped ? 'active' : ''}`)} onClick={handleClick}>
            <img src="imgs/cover.png" alt="Card overlay" className={styles['overlay']} />
            <div className={styles['content']}>
                <span className={styles['value']}>{card.src}</span>
            </div>
        </div>
    )
}
