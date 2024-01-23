import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// Firebase
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebase/config'
import { doc, setDoc } from 'firebase/firestore'
// Utils
import { GetModuleStylesGetter } from '../../utils/styles.util'
// Icons
import { AiOutlineStar, AiFillStar } from 'react-icons/ai'
import { CiBullhorn } from 'react-icons/ci'
import { HiMiniXMark } from 'react-icons/hi2'
import { VscDebugRestart } from 'react-icons/vsc'
// Utils
import { translateWord } from '../../utils/translateWord.util'
// Styles
import styles from '../../styles/pages/article.module.css'

/**
 * Styles getter shorthand
 */
const getStyles = GetModuleStylesGetter(styles)

/**
 * Component renders the article page.
 */
function Main({ setData, data, getFavoriteArticles, userData }) {
    // States
    const navigate = useNavigate()
    const { title } = useParams()
    const [user, loading, error] = useAuthState(auth)
    const [isSpeechActive, setIsSpeechActive] = useState(false)
    const [speech, setSpeech] = useState({
        hasStartedSpeeking: false,
        isSpeeking: false,
    })

    // Handlers
    async function toggleFavorite() {
        // function toggles the article in the favorite list.

        if (!data.article) {
            alert('Article is not loaded yet or does not exist.')
            return
        }
        try {
            // Toggle article title in favorite articles array
            const userRef = doc(db, 'users', user?.uid)
            console.log('favorite not loaded')
            if (!data.favoriteArticles) {
                // Get favorite articles before proceeding
                await getFavoriteArticles()
            }
            const isFavorite = data.favoriteArticles.includes(data.article.title)
            // Update favorite articles array by action
            const updatedFavoriteArticles = isFavorite
                ? data.favoriteArticles.filter(a => a !== data.article.title)
                : [...data.favoriteArticles, data.article.title]

            // Update state and db
            setData(s => ({ ...s, favoriteArticles: updatedFavoriteArticles }))
            await setDoc(userRef, { favoriteArticles: updatedFavoriteArticles }, { merge: true })
        } catch (err) {
            alert(err.message ?? err.data ?? 'Something went wrong.')
        }
    }

    function toggleSpeech() {
        // Funcion toggles speech on/off

        // Validate article
        if (!data.article) {
            alert('Article is not loaded yet or does not exist.')
            return
        }

        // Create new speech synthesis
        const ssu = new SpeechSynthesisUtterance(data.article.content)
        ssu.voice = speechSynthesis.getVoices()[0]

        console.log({ pending: speechSynthesis.pending, paused: speechSynthesis.paused })

        // Speech has not started yet - start speaking
        if (!speech.hasStartedSpeeking) {
            setSpeech(s => ({ ...s, hasStartedSpeeking: true }))
        }

        if (speech.isSpeeking) {
            // Speech is active - pause
            setSpeech(s => ({ ...s, isSpeeking: false }))
            speechSynthesis.pause()
        } else {
            // Speech is not active - start speaking
            setSpeech(s => ({ ...s, isSpeeking: true }))
            if (speech.hasStartedSpeeking) {
                // Speech is paused - resume
                speechSynthesis.resume(ssu)
            } else {
                // Speech is pending - start speaking
                speechSynthesis.speak(ssu)
            }
        }
        // Update is-speech-active state
        setIsSpeechActive(s => !s)
    }

    function resetSpeech() {
        // Function resets speech

        // Validate article
        if (!data.article) {
            alert('Article is not loaded yet or does not exist.')
            return
        }

        // Create new speech synthesis
        const ssu = new SpeechSynthesisUtterance(data.article.content)
        ssu.voice = speechSynthesis.getVoices()[0]

        // Reset speech
        speechSynthesis.cancel()
        speechSynthesis.speak(ssu)
    }

    return (
        <div className={styles['Article']}>
            <section className={styles['main-controls']}>
                <button
                    className={styles['toggle-speech']}
                    onClick={toggleSpeech}
                    title={isSpeechActive ? 'Pause' : 'Play'}
                >
                    {isSpeechActive ? <HiMiniXMark size={18} /> : <CiBullhorn size={18} />}
                </button>
                <button
                    className={getStyles(`restart-speech ${isSpeechActive ? '' : 'hide'}`)}
                    onClick={resetSpeech}
                    title="Restart"
                >
                    <VscDebugRestart size={18} />
                </button>
            </section>
            <section className={styles['text']}>
                {data.article ? (
                    <>
                        <div className={styles['heading']}>
                            <h2>Title: {data.article?.title}</h2>
                            <span>
                                {data.isFavorite ? (
                                    <AiFillStar size={26} onClick={toggleFavorite} />
                                ) : (
                                    <AiOutlineStar size={26} onClick={toggleFavorite} />
                                )}
                            </span>
                        </div>
                        <span className={styles['introduction']}>
                            <b>Introduction:</b>&nbsp;
                            {data.article?.content?.split(' ').map((w, i) => (
                                <span key={i}>
                                    <HighlightWords key={i} w={w} meaning={translateWord(w, userData.difficulty)} />
                                    &nbsp;
                                </span>
                            ))}
                        </span>
                    </>
                ) : (
                    <img src="/imgs/loading.gif" alt="Loading" className={styles['loading']} />
                )}
            </section>
            <section className={styles['game-controls']}>
                <button
                    onClick={() => navigate(`/article/${title.replace(/[^a-zA-Z0-9 ]/g, '')}/questions`)}
                    title="Questions"
                >
                    <img src="/imgs/questions.jpeg" alt="Questions" />
                </button>
                <button onClick={() => navigate(`/memoryGame`)} title="Memory game">
                    <img src="/imgs/memory.jpeg" alt="Memory game" />
                </button>
            </section>
        </div>
    )
}

export default Main

// Helper components

/**
 * Component gets a word and returns a highlighted word with explanation.
 * The component currently determines the highlighted word via a 10% probability function, but a defined function can be implemented later.
 */
function HighlightWords({ w, meaning }) {
    // States
    const [show, setShow] = useState(false)
    // Handlers
    const showHandler = () => {
        if (meaning) setShow(!show)
    }
    return (
        <span className={meaning ? styles['marked'] : ''} onClick={showHandler}>
            {show ? <>&nbsp;&nbsp;{meaning}&nbsp;&nbsp;</> : w}
        </span>
    )
}
