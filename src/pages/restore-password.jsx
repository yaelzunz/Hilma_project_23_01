import { useState } from 'react'
import { NavLink } from 'react-router-dom'
// Assets
import { BiHide, BiShow } from 'react-icons/bi'
import { FcGoogle } from 'react-icons/fc'
import { AiOutlineLock } from 'react-icons/ai'
// Styles
import styles from '../styles/pages/restore-password.module.css'
import { GoArrowRight } from "react-icons/go";

// firebase
import {sendPasswordResetEmail} from 'firebase/auth'
import { auth } from "../firebase/config";
import firebase from 'firebase/app';
import 'firebase/auth';



/**
 * Component renders the restore-password page.
 */
function RestorePassword() {
    // States
    const [isShowingPassword, setIsShowingPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState("");

    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailError('האימייל שהתקבל לא בתבנית הנכונה');
        return
    }
    else {setEmailError('')};

        console.log('hjhklm')
        try {
          await sendPasswordResetEmail(auth, email);
          setMessage('Password reset email sent! Please check your email.');
          setEmail('');
        } catch (error) {
          setMessage(error.message);
        }
      };



    return (
        <div className={styles["Login"]}>
            <img src="imgs/bulb-books.png" alt="bulb-books" />
            <div className={styles["modal"]}>
                <div className={styles["title"]}>
                    <AiOutlineLock size={24} />
                    <h1>שחזור סיסמא</h1>
                </div>
                <form className={styles["email-verification"]}>
                    <div className={styles["input-text"]}>
                        <label htmlFor="email">רשום את חשבון האימייל שלך</label>
                        <input type="email" id='email' onChange={e => setEmail(e.target.value)} />
                    </div>
                        <p style={{ color: 'red' }}>{emailError}</p>
                    <div className={styles["input-submit"]}>
                        <input type="submit" value="שלח" onClick={handleResetPassword}/>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default RestorePassword