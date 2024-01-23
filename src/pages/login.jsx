import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
// Assets
import { BiHide, BiShow } from 'react-icons/bi'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineLock } from 'react-icons/ai'
// Styles
import styles from '../styles/pages/login.module.css'
import { Alert } from '@mui/material';

// firebase
import { signInWithEmailAndPassword, signInWithPopup, sendSignInLinkToEmail } from "firebase/auth";
import { auth, provider } from "../firebase/config";


function Login() {
    
    // States
    const queryParams = new URLSearchParams(window.location.search)
    const success_register_name = queryParams.get('success_register_name')

    const [isShowingPassword, setIsShowingPassword] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState('');
    const [value, setValue] = useState('');
    const [error, setError] = useState("");
    const [isEmpty, setIsEmpty] = useState("");


    // handlers
    const handleLogin = async e => {
        e.preventDefault();
        setError('')
        setIsEmpty('')
        setEmailError('');
        if (email === "" || password === "") {
            setIsEmpty("אחד מהשדות ריק")

        }
            // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailError('האימייל שהתקבל לא בתבנית הנכונה');
        return;
      }
        else {
            try {
                // Sign in with email and password
                await signInWithEmailAndPassword(auth, email, password)
                console.log("Logged in successfully!")
                // Email verification
                const email_res = await sendSignInLinkToEmail(auth, email, {
                    url: "http://localhost:3000/home",
                    handleCodeInApp: true,
                })
                console.log({email_res})
                alert("שלחנו לך לינק למייל שהזנת. לחץ עליו ותוכל להמשיך לאתר :)")
            }
            catch (err) {
                // Invalid credentials
                console.error({err})
                setError("שם משתמש או סיסמה לא נכונים")
                
            }
        }
    }
    const handleLoginWithGoogle = async e => {
        // Login with google
        e.preventDefault();
        try {
            const data = await signInWithPopup(auth, provider)
            console.log({data})
            setValue(data.user.email)
            localStorage.setItem("email", data.user.email)
        }
        catch(err) {
            console.log({err})
        }
    }

    // Effects
    useEffect(() => {
        if (success_register_name) {
            alert(`Signup Success! Login to your account, ${success_register_name}`)
        }
    }, [])

    return (
        <div className={styles["Login"]}>
            <img src="imgs/bulb-books.png" alt="bulb-books" />
            <div className={styles["modal"]}>
                <h1>התחברות</h1>
                <form>
                {error && <Alert severity="error">{error}</Alert>}
                {!error && isEmpty && <Alert severity="error">{isEmpty}</Alert>}

                    <div className={styles["input-text"]}>
                        <input type="text" placeholder="אימייל" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <p style={{ color: 'red' }}>{emailError}</p>
                    </div>
                    <div className={styles["input-text"]}>
                        <input type={isShowingPassword ? "text" : 'password'} placeholder="סיסמא" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <div className={styles["show-input"]} 
                            title={`${isShowingPassword ? 'Hide' : 'Show'} password`}
                            onClick={() => setIsShowingPassword(s => !s)}>
                            { isShowingPassword 
                                ? <BiShow size={18} />
                                : <BiHide size={18} />
                            }
                        </div>
                    </div>
                    <section className={styles["or"]}>
                        <span>or</span>
                    </section>
                    { value 
                        ? window.location.href = '/home' 
                        : <button className={styles["loginopt-google"]} onClick={(e) => handleLoginWithGoogle(e)}>
                            <span>התחברות באמצעות גוגל</span>
                            <FcGoogle size={30} />
                        </button>
                    }
                    <section className={styles["links"]}>
                        <NavLink to='/signup' className={styles['signup']}>
                            <span>אין לך משתמש? צור עכשיו</span>
                        </NavLink>
                        <NavLink to='/restore-password' className={styles['forgot-password']}>
                            <AiOutlineLock size={14} />
                            <span>שכחת סיסמא?</span>
                        </NavLink>
                    </section>
                    <input type="submit" value="התחבר" onClick={(e)=> handleLogin(e)}/>
                </form>
            </div>
        </div>
    )
}

export default Login