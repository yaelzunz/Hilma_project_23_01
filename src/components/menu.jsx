import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Firebase
import { db } from '../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
// Icons
import { AiOutlineTeam } from 'react-icons/ai'
import { LiaUserSlashSolid } from 'react-icons/lia'
import { AiFillTag, AiFillEdit } from 'react-icons/ai'
// Styles
import styles from '../styles/components/menu.module.css'

/**
 * Component renders the app main menu.
 */
export default function Menu({ setMenuStatus, setChangingInterests, setData }) {
    // States
    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth)
    // Interests
    const [currentUser, setCurrentUser] = useState(null)
    const [clicked, setClicked] = useState(false)

    // Handlers

    const handleDeleteUser = async () => {
        setClicked(true)
        // Function handles user account deletion
        // Confirm delete
        const confirmDelete = window.confirm(
            'Are you sure you want to delete your account forever? This action is irreversible.'
        )

        // If user canceled delete, return
        if (!confirmDelete) return

        try {
            const user = auth.currentUser
            if (!user) return
            // Delete the user account
            const res = await user.delete()
            console.log('User account deleted successfully.')
            // Sign out and redirect to login page
            auth.signOut()
            window.location.href = '/login'
        } catch (error) {
            console.error('Error deleting user:', error.message)
        }
    }

    function onExitMenuHandler() {
        setTimeout(() => {
            setMenuStatus(false)
        }, 2000)
    }

    // Effects
    useEffect(() => {
        // Set up an authentication state observer
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user)
                console.log({ user })
            } else {
                setCurrentUser(null)
            }
        })

        // Cleanup the observer when the component unmounts
        return () => unsubscribe()
    }, [user])

    return (
        <button className={styles['Menu']} onBlur={onExitMenuHandler} autoFocus>
            <div className={styles['btns-list']}>
                <button className={styles['btn-delete-user']} onClick={handleDeleteUser}>
                    מחק את המשתמש לצמיתות
                    <LiaUserSlashSolid size={24} />
                </button>
                <button className={styles['btn-change-interesets']} onClick={() => setChangingInterests(true)}>
                    שינוי תחומי העיניין
                    <AiFillTag size={24} />
                </button>
                <button className={styles['btn-change-pwd']} onClick={() => navigate('/restore-password')}>
                    שינוי סיסמא
                    <AiFillEdit size={24} />
                </button>

                {currentUser && currentUser.email === 'yaelzu1995@gmail.com' && (
                    <button className={styles['btn-manage-users']} onClick={() => navigate('/manger')}>
                        ניהול משתמשים
                        <AiOutlineTeam size={24} />
                    </button>
                )}
            </div>
            {/* interests floating modal */}
        </button>
    )
}






// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// // Firebase
// import { db } from '../firebase/config'
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../firebase/config'
// import { updateDoc, doc, getDoc } from 'firebase/firestore'
// // Data
// import * as WordDifficulty from '../difficulty/WordDifficulty';
// // Assets
// import { LiaUserSlashSolid } from 'react-icons/lia'
// import { AiFillTag, AiFillEdit } from 'react-icons/ai'
// // Components
// import InterestsModal from './interests-modal';
// // Styles
// import styles from '../styles/components/menu.module.css'
// import { AiOutlineTeam } from "react-icons/ai";




// /**
//  * Component renders the app main menu.
//  */
// export default function Menu({ setMenuStatus }) {
  
//   // States
//   const navigate = useNavigate()
//   const [user, loading, error] = useAuthState(auth)
//   // Interests
//   const [changingInterests, setChangingInterests] = useState(false)
//   const [data, setData] = useState({
//     interests: [],
//     difficulty: 'easy'
//   })
//   const [currentUser, setCurrentUser] = useState(null);
//   const [clicked, setClicked] = useState(false);

  
//   // Handlers
//   const loadInterests = async () => {
//     // Determine if article is in favorite list
//     const userRef = doc(db, 'users', user?.uid)
//     const userDoc = await getDoc(userRef)
//     const userData = userDoc.data()
//     setData({
//       interests: userData.interests,
//       difficulty: userData.difficulty
//     })
//   }

//   const changeInterestsHandler = async data => {
//     // Function handles change of interests and difficulty
//     try {
//       // Update user interests
//       const userRef = doc(db, 'users', user?.uid)
//       await updateDoc(userRef, {
//         interests: data.interests,
//         difficulty: data.difficulty
//       })
//       setChangingInterests(false)
//     }
//     catch (error) {
//       console.log('Error updating user interests:', error.message);
//     }
//   }

//   const handleDeleteUser = async () => {
//     setClicked(true)
//     // Function handles user account deletion
//     // Confirm delete
//     const confirmDelete = window.confirm(
//       'Are you sure you want to delete your account forever? This action is irreversible.'
//     )

//     // If user canceled delete, return
//     if (!confirmDelete) return

//     try {
//       const user = auth.currentUser;
//       if (!user) return
//       // Delete the user account
//       const res = await user.delete()
//       console.log('User account deleted successfully.');
//       // Sign out and redirect to login page
//       auth.signOut()
//       window.location.href = '/login'; 
//     }
//     catch (error) {
//       console.error('Error deleting user:', error.message);
//     }
//   }

  

//   // Effects
//   useEffect(() => {
//     // On user load
//     console.log(user)
//     if (user) {
//         // Load data on initial page load.
//         loadInterests()
//     }

//      // Set up an authentication state observer
//      const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setCurrentUser(user);
//         console.log(user)
//       } else {
//         setCurrentUser(null);
//       }
//     });

//     // Cleanup the observer when the component unmounts
//     return () => unsubscribe();
// }, [user])


//   return (
//     <>
//       <div className={styles["Menu"]}>
//           <div className={styles["btns-list"]}>
//               <button onClick={handleDeleteUser}>
//                   מחק את המשתמש לצמיתות
//                   <LiaUserSlashSolid size={24} />
//               </button>
//               <button onClick={() => setChangingInterests(true)}>
//                   שינוי תחומי העיניין
//                   <AiFillTag size={24}/>
//               </button>
//               <button onClick={() => navigate('/restore-password')}>
//                   שינוי סיסמא
//                   <AiFillEdit size={24}/>
//               </button>

//               {currentUser && currentUser.email === 'yaelzu1995@gmail.com' && (
//                   <button onClick={() => navigate('/manger')}>
//                   ניהול משתמשים
//                   <AiOutlineTeam size={24}/>
//               </button>
//       )}
//           </div>
//           {/* interests floating modal */}
//       </div>
//       { changingInterests && <InterestsModal onSubmit={changeInterestsHandler} defaultData={data} /> }
//     </>
//   )
// }
