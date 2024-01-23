import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config'
import { Route, Routes, RouterProvider, useNavigate } from 'react-router-dom'
// Pages
import Login from '../pages/login'
import Signup from '../pages/signup'
import RestorePassword from '../pages/restore-password'
import PageNotFound from '../pages/404'
import Home from '../pages/home'
import Search from '../pages/search'
import Manger from '../pages/manger'
import MemoryGame from '../pages/memoryGame'
import Article from '../pages/article'

/**
 * Component renders the current active page using `react-router-dom`. The component shold be renderen directly from `App.js`.
 */
function AppRouter({ data }) {
    // Auth state
    // Chech auth state, if no authorized redirect to login
    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth)
    console.log(user, loading, error)

    // Effects
    useEffect(() => {
        if (!loading && !user) {
            // Auth unsuccessfull
            navigate('/login')
        }
    }, [user, loading])

    return (
        // משמש לסימון אזור התוכן הראשי של המסמך, לא כולל כותרות עליונות, כותרות תחתונות, סרגלי צד וקישורי ניווט - main
        <main>
            <Routes>
                <Route path="/" element={<Login data={data} />} />
                <Route path="login" element={<Login data={data} />} />
                <Route path="signup" element={<Signup data={data} />} />
                <Route path="home" element={<Home data={data} />} />
                <Route path="search" element={<Search data={data} />} />
                <Route path="article/:title/*" element={<Article data={data} />} />
                <Route path="restore-password" element={<RestorePassword data={data} />} />
                <Route path="memoryGame" element={<MemoryGame data={data} />} />
                <Route path="manger" element={<Manger data={data} />} />
                <Route path="*" element={<PageNotFound data={data} />} />
            </Routes>
        </main>
    )
}

export default AppRouter
