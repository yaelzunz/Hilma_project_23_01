import { useState } from 'react'
// Data
import Interests from '@/../../public/data/interests.json'
// Components
import BtnGoBack from './BtnGoBack'
// Styles
import styles from '../styles/components/interests-modal.module.css'

/**
 * Function renders the interests modal.
 * @param props.onSubmit function callback invoked when user submits the form `:function`.
 */
export default function InterestsModal({ onSubmit, defaultData = null, setChangingInterests }) {
    // States
    const [step, setStep] = useState(1)
    const [data, setData] = useState({
        interests: defaultData?.interests ?? [],
        difficulty: defaultData?.difficulty ?? 'easy',
    })

    // Handlers
    function finishHandler() {
        // Validate and invoke given signup function
        if (data.difficulty === null || !data.interests.length) {
            alert('אחד מהשדות ריק')
        } else onSubmit(data)
    }

    function setDifficlty(difficulty) {
        // Function sets the selected difficulty.
        setData(s => ({ ...s, difficulty }))
    }

    function toggleInterestInList(interest, isChecked) {
        // Function toggles interest in list
        if (isChecked) {
            // Add interest to list.
            setData(s => ({ ...s, interests: [...s.interests, interest] }))
        } else {
            // Remove interest from list.
            setData(s => ({ ...s, interests: s.interests.filter(i => i !== interest) }))
        }
    }

    // Render step 1
    if (step === 1)
        return (
            <div className={styles['modal-interests-wrapper']}>
                <div className={styles['modal-interests']}>
                    {/* btn back */}
                    <BtnGoBack title={'Exit'} onClick={() => setChangingInterests(false)} />
                    {/* modal */}
                    <div className={styles['header']}>
                        <img src="/imgs/logo.png" alt="logo" />
                        <span>A moment before we start.</span>
                        <p>What are your most 5 favorite topics?</p>
                    </div>
                    <div className={styles['body']}>
                        <div className={styles['topics-list']}>
                            {Interests.map(interest => (
                                // Render interest checkbox
                                <label
                                    key={interest}
                                    className={`${styles['interest-checkbox']} ${
                                        data.interests.includes(interest) ? styles['selected'] : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={interest}
                                        checked={data.interests.includes(interest)}
                                        onChange={e => toggleInterestInList(interest, e.target.checked)}
                                    />
                                    <span>{interest}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className={styles['btns']}>
                        <button className={styles['continue']} onClick={() => setStep(2)}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        )
    // Render step 2
    else if (step === 2)
        return (
            <div className={styles['modal-interests-wrapper']}>
                <div className={styles['modal-interests']}>
                    <div className={styles['header']}>
                        <img src="/imgs/logo.png" alt="logo" />
                        <span>A moment before we start.</span>
                        <p>Select your difficulty.</p>
                    </div>
                    <div className={styles['body']}>
                        <div className={styles['difficulty']}>
                            {/* difficulty : hard */}
                            <label htmlFor="difficulty-hard">Hard</label>
                            <input
                                type="radio"
                                name="difficulty"
                                id="difficulty-hard"
                                value="hard"
                                defaultChecked={data.difficulty === 'hard'}
                                onChange={() => setDifficlty('hard')}
                            />

                            {/* difficulty : easy */}
                            <label htmlFor="difficulty-easy">Easy</label>
                            <input
                                type="radio"
                                name="difficulty"
                                id="difficulty-easy"
                                value="easy"
                                defaultChecked={data.difficulty === 'easy'}
                                onChange={() => setDifficlty('hard')}
                            />
                        </div>
                    </div>
                    <div className={styles['btns']}>
                        <button className={styles['back']} onClick={() => setStep(1)}>
                            Back
                        </button>
                        <button className={styles['continue']} onClick={finishHandler}>
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        )
}
