import { useNavigate } from 'react-router-dom'
// Icons
import { IoReturnUpBackOutline } from 'react-icons/io5'
// Styles
import styles from '../styles/components/btn-go-back.module.css'

/**
 * Component renders the go-back button for pages with limited navigation.
 * Component requires the parent component to have a `position: relative` to render at the top-left.
 */
export default function BtnGoBack({ title, onClick }) {
    // States
    const navigate = useNavigate()

    // Handlers
    function onClickHandler() {
        if (onClick) onClick()
        else navigate(-1)
    }

    return (
        <button type="button" className={styles['go-back']} onClick={onClickHandler} title={title ?? 'Go back'}>
            <IoReturnUpBackOutline size={18} />
        </button>
    )
}
