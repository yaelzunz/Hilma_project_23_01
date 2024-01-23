// Components
import QuestionForm from '../../components/article/Question'
import BtnGoBack from '../../components/BtnGoBack'
// Styles
import styles from '../../styles/pages/questions.module.css'

/**
 * Component renderts the Article.Questions page.
 */
export default function Questions({ data }) {
    return (
        <div className={styles['Questions']}>
            {/* btn : back */}
            <BtnGoBack title="Back to article" />
            {/* content */}
            {data.questions?.length ? (
                <form className={styles['questions-list']}>
                    {data.questions?.map((q, i) => (
                        <QuestionForm key={i} {...q} />
                    ))}
                </form>
            ) : (
                <div className={styles['loading']}>
                    <img src="/imgs/loading.gif" alt="Loading Questions..." />
                    <span>Loading questions...</span>
                </div>
            )}
        </div>
    )
}
