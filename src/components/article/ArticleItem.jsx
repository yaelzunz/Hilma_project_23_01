import { useNavigate } from 'react-router-dom'
// Styles
import styles from '../../styles/components/article-item.module.css'

// Default image url
const DEFAULT_IMG_URL =
    'https://avatars.mds.yandex.net/i?id=47c293f66ae2dc215b27c504a76c026c-3757598-images-thumbs&n=13'

/**
 * Compnent renders an article item.
 * @param article The article details.
 */
export default function ArticleItem({ title, description, image_url }) {
    // States
    const navigate = useNavigate()
    // const title_id = title.replace(/[^a-zA-Z0-9 ]/g, '')    Remove all non-alphanumeric characters from the title

    return (
        <div className={styles['article']} onClick={() => navigate(`/article/${title.replace(/[^a-zA-Z0-9 ]/g, '')}`)}>
            <h4 className={styles['title']}>{title}</h4>
            {/* <p className={styles["description"]}>{description}</p> */}
            <img
                src={image_url ?? DEFAULT_IMG_URL}
                onError={e => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = DEFAULT_IMG_URL
                }}
                alt="imageurl"
            />
        </div>
    )
}
