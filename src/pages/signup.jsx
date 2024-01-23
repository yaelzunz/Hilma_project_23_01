import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
// Assets
import Interests from '@/../../public/data/interests.json'
import { BiHide, BiShow } from 'react-icons/bi'
import { FcGoogle } from 'react-icons/fc'
// Components
import InterestsModal from '../components/interests-modal'
// Styles
import styles from '../styles/pages/signup.module.css'
import { Alert } from '@mui/material'

// firebase
import {
    createUserWithEmailAndPassword,
    sendSignInLinkToEmail,
    updateProfile,
    signInWithPopup,
    deleteUser,
} from 'firebase/auth'
import { auth, db, provider } from '../firebase/config'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'

export default function Signup() {
    // Firebase
    const usersRef = collection(db, 'users')

    // States
    const navigate = useNavigate()
    const [hasAuthenticatedWithGoogle, setHasAuthenticatedWithGoogle] = useState(false)
    const [isShowingPassword, setIsShowingPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState(null)
    const [selectedInterests, setSelectedInterests] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    /**
     * Function handles signup.
     * @param data the data to signup with (exists when signing up via google, otherwise use states).
     */

    const handleSignup = async data => {
        // Validations
        if (!handlePasswordChange(password)) {
            setPasswordError('הסיסמה חייבת להכיל אות גדולה, מספר ותו')
        } else {
            setPasswordError('')
        }

        if (
            email === '' ||
            password === '' ||
            name === '' ||
            selectedDifficulty === null ||
            !selectedInterests.length
        ) {
            setError('אחד מהשדות ריק')
        } else {
            setError('')
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('האימייל שהתקבל לא בתבנית הנכונה')
            return
        } else {
            setEmailError('')
        }

        if (hasAuthenticatedWithGoogle && data) {
            // User has authenticated with google, signup with remaining data
            // Create new user entry in users document
            const res = await setDoc(doc(db, 'users', auth.currentUser.uid), {
                name: name,
                email: email,
                difficulty: data.difficulty,
                interests: data.interests,
                uid: auth.currentUser.uid,
            })
            // Navigate to login page
            navigate(`/login?success_register_name=${name}`)
        } else if (
            email === '' ||
            password === '' ||
            name === '' ||
            selectedDifficulty === null ||
            !selectedInterests.length
        ) {
            setError('אחד מהשדות ריק')
        } else {
            // Create user in firebase auth
            try {
                // Create new user in firebase Auth
                const cred = await createUserWithEmailAndPassword(auth, email, password)
                // Update auth profile
                updateProfile(cred.user, {
                    displayName: `${name}`,
                    photoURL: null,
                })
                // Create new user entry in users document
                const res = await setDoc(doc(db, 'users', cred.user.uid), {
                    name: name,
                    email: email,
                    difficulty: selectedDifficulty,
                    interests: selectedInterests,
                    uid: cred.user.uid,
                })
                // Navigate to login page
                navigate(`/login?success_register_name=${name}`)
            } catch (err) {
                // Error in signup
                // alert("Error in Signup" + err.message)
                setError('Error in Signup ' + err.message)
            }
        }
    }

    // Event handler to update the selected difficulty when a radio button is clicked
    const handleDifficultyChange = event => {
        const selectedValue = event.target.value
        setSelectedDifficulty(selectedValue)
    }

    // Event handler to update the selected interests array when checkboxes are checked or unchecked
    const handleInterestChange = event => {
        const interest = event.target.value
        const isChecked = event.target.checked

        if (isChecked) {
            setSelectedInterests(prevSelectedInterests => [...prevSelectedInterests, interest])
        } else {
            setSelectedInterests(prevSelectedInterests => prevSelectedInterests.filter(item => item !== interest))
        }
    }

    // Signup with Google
    const handleLoginWithGoogle = async e => {
        e.preventDefault()
        try {
            const data = await signInWithPopup(auth, provider)
            setHasAuthenticatedWithGoogle(true)
            // Save OAuth data
            setEmail(data.user.email)
            setName(data.user.displayName)
        } catch (err) {
            console.log(err)
        }
    }

    const handlePasswordChange = password => {
        // Validate the password when it changes
        if (password.length < 8) {
            return false
        }
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        if (!hasUpperCase || !hasLowerCase) {
            return false
        }
        const hasNumbers = /\d/.test(password)
        if (!hasNumbers) {
            return false
        }
        const hasSpecialChars = /[-!$%^@#&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(password)
        if (!hasSpecialChars) {
            return false
        }
        return true
    }

    return (
        <div className={styles['Signup']}>
            <div className={styles['modal']}>
                <div className={styles['title']}>
                    <h1>הרשמה</h1>
                    <h3>בואו לגלות את קאפיש</h3>
                </div>

                <form>
                    <section className={styles['inputs-l']}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <div className={styles['input-radio']}>
                            <span>רמת קושי</span>
                            <div className={styles['radio-list']}>
                                <label htmlFor="hard">Hard</label>
                                <input
                                    type="radio"
                                    name="difficulty"
                                    id="hard"
                                    value="hard"
                                    onChange={handleDifficultyChange}
                                />
                                <label htmlFor="easy">Easy</label>
                                <input
                                    type="radio"
                                    name="difficulty"
                                    id="easy"
                                    value="easy"
                                    onChange={handleDifficultyChange}
                                />
                            </div>
                        </div>

                        <button className={styles['Signupopt-google']} onClick={handleLoginWithGoogle}>
                            <span>התחברות באמצעות גוגל</span>
                            <FcGoogle size={30} />
                        </button>
                    </section>

                    <section className={styles['inputs-r']}>
                        <div className={styles['input-text']}>
                            <input
                                type="text"
                                placeholder="שם מלא"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className={styles['input-select']}>
                            <div className={styles['input-text']} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <input
                                    type="text"
                                    placeholder="תחומי עיניין"
                                    value={selectedInterests.join(', ')}
                                    readOnly={true}
                                />
                            </div>
                            {isDropdownOpen && (
                                <div className={styles['checkbox-list']}>
                                    {Interests.map(interest => (
                                        <label key={interest} className={styles['checkbox-label']}>
                                            <input
                                                type="checkbox"
                                                value={interest}
                                                checked={selectedInterests.includes(interest)}
                                                onChange={handleInterestChange}
                                                className={styles['checkbox-input']}
                                            />
                                            <span className={styles['custom-checkbox']} />
                                            {interest}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles['input-text']}>
                            <input
                                type="text"
                                placeholder="אימייל"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <p className={styles['msg-err']}>{emailError}</p>
                        </div>

                        <div className={styles['input-text']}>
                            <input
                                type={isShowingPassword ? 'text' : 'password'}
                                placeholder="צור סיסמא"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            {passwordError && <p className={styles['msg-err']}>{passwordError}</p>}

                            <div
                                className={styles['show-input']}
                                title={`${isShowingPassword ? 'Hide' : 'Show'} password`}
                                onClick={() => setIsShowingPassword(s => !s)}
                            >
                                {isShowingPassword ? <BiShow size={18} /> : <BiHide size={18} />}
                            </div>
                        </div>

                        <section className={styles['links']}>
                            <NavLink to="/login" className={styles['login']}>
                                <span>יש לך כבר חשבון? התחבר</span>
                            </NavLink>
                        </section>

                        <button type="button" onClick={handleSignup} className={styles['submit']}>
                            הירשם
                        </button>
                    </section>
                </form>
            </div>
            {/* interests modal - when signing up with google */}
            {hasAuthenticatedWithGoogle && <InterestsModal onSubmit={handleSignup} />}
        </div>
    )
}
