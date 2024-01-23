import { useState } from 'react'
// Styles
import styles from '../../styles/components/question.module.css'

/**
 * Component renders an article question form
 */
export default function QuestionForm({ question, answer, opts }) {
    // States
    const [value, setValue] = useState('')
    const [isShowingButton, setIsShowingButton] = useState(false)

    // Handlers
    function toggleVisibility() {
        setIsShowingButton(!isShowingButton)
    }

    function onChangeHandler(v) {
        // Function handles the change event
        setValue(v)
        setIsShowingButton(false)
    }

    function checkAnswer() {
        // Fucntion checks if answer includs the value. (customizable)
        if (!value) {
            return false
        }
        return answer?.toString().toLowerCase() === value?.toString().toLowerCase()
    }

    return (
        <section className={styles['question-container']}>
            <section className={styles['question']}>
                <h4>שאלה:</h4>
                <span>{question}</span>
            </section>
            <section className={styles['answer']}>
                <h4>{opts ? 'תשובות:' : 'תשובה:'}</h4>
                {!opts ? (
                    <textarea
                        cols="30"
                        rows="10"
                        placeholder="כתוב כאן"
                        onChange={e => onChangeHandler(e.target.value)}
                    />
                ) : (
                    <ol className={styles['options-list']}>
                        {opts?.map((o, i) => (
                            <li key={i}>{o}</li>
                        ))}
                    </ol>
                )}
            </section>

            <button className={styles['check-ans']} type="button" onClick={toggleVisibility}>
                בדוק תשובה
            </button>
            {isShowingButton && (
                <section className={styles['q-summary']} key={isShowingButton}>
                    <span className={styles['status']}>תשובה {checkAnswer() ? '' : 'לא '}נכונה!</span>
                    <span className={styles['answer']}>התשובה: {answer}</span>
                </section>
            )}
        </section>
    )
}
