import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
// Firebase
import { db } from './firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase/config'
import { updateDoc, doc, getDoc } from 'firebase/firestore'
// Constants
import { PROTECTED_URLS } from './configs/url.config'
// Components
import AppRouter from './components/router'
import Header from './components/header'
import Menu from './components/menu'
import InterestsModal from './components/interests-modal'
// Styles
import './styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
    // States
    const [user, loading, error] = useAuthState(auth)
    const [menuStatus, setMenuStatus] = useState(false)
    const [changingInterests, setChangingInterests] = useState(false)
    const [data, setData] = useState({
        interests: [],
        difficulty: 'easy',
    })

    const pathname = window.location.pathname
    // PROTECTED_URLS המשתנה מוגדר על סמך האם שם הנתיב הנוכחי תואם לכל אחד מהנתיבים במערך .
    const isProtectedPage = PROTECTED_URLS.some(u => pathname.startsWith(u))

    // header will not appear in signup and login page
    const isLoginOrSignup = pathname === '/login' || pathname === '/signup' || pathname === '/'

    // Handlers
    async function changeInterestsHandler(data) {
        // Function handles change of interests and difficulty
        try {
            // Update user interests
            const userRef = doc(db, 'users', user?.uid)
            await updateDoc(userRef, {
                interests: data.interests,
                difficulty: data.difficulty,
            })
            setChangingInterests(false)
        } catch (error) {
            console.log('Error updating user interests:', error.message)
        }
    }

    async function loadInterests() {
        // Determine if article is in favorite list
        const userRef = doc(db, 'users', user?.uid)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        setData({
            interests: userData.interests,
            difficulty: userData.difficulty,
        })
    }

    // Effects
    useEffect(() => {
        // On user load
        if (user) {
            // Load data on initial page load.
            loadInterests()
        }
    }, [user])

    return (
        <div className={`App ${isProtectedPage ? '' : 'non-protected'}`}>
            <BrowserRouter>
                {isLoginOrSignup ? null : <Header setMenu={setMenuStatus} />}

                {/* menu : conditional rendering */}
                {menuStatus && (
                    <Menu setMenuStatus={setMenuStatus} setData={setData} setChangingInterests={setChangingInterests} />
                )}

                {changingInterests && (
                    <InterestsModal
                        onSubmit={changeInterestsHandler}
                        defaultData={data}
                        setData={setData}
                        setChangingInterests={setChangingInterests}
                    />
                )}

                {/* dynamic page renderer */}
                <AppRouter data={data} />

                {/* app footer */}
                {isProtectedPage && (
                    <footer>
                        <img src="/imgs/logo-footer.png" alt="Logo footer" />
                    </footer>
                )}
            </BrowserRouter>
        </div>
    )
}

export default App
