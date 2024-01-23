import { useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
// Configs
import { NEWS_API_URL } from '../../configs/url.config'
// Firebase
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
// Utils
import { GPTClient } from '../../utils/gptclient.util'
// Pages
import Main from './main'
import Questions from './questions'

/**
 * Component renders the article main view page.
 */
function Article({ data: userData }) {
    // States
    const { title } = useParams()
    const [user, loading, error] = useAuthState(auth)
    const [data, setData] = useState({
        article: null,
        isFavorite: false,
        favoriteArticles: [],
        questions: [],
    })

    // Handlers (data loaders)
    async function loadArticle() {
        // Load article data
        const res = await fetch(NEWS_API_URL.by_title(title))
        const data = await res.json()
        const article = data.results?.[0]
        console.log({ article, title })
        setData(s => ({ ...s, article }))

        // Determine if article is in favorite list
        await getFavoriteArticles()
    }

    async function getFavoriteArticles() {
        // Determine if article is in favorite list
        const userRef = doc(db, 'users', user?.uid)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        // Update favorite articles
        const favoriteArticles = userData.favoriteArticles ?? []
        setData(s => ({
            ...s,
            favoriteArticles: favoriteArticles,
            isFavorite: favoriteArticles.includes(data.article?.title),
        }))
    }

    async function loadQuestions() {
        // Get questions
        const questions = await GPTClient.getQuestions(data.article.title, data.article.content)
        setData(s => ({ ...s, questions }))
    }

    // Effects
    useEffect(() => {
        // On user load
        console.log(user)
        if (user) {
            // Load data on initial page load.
            loadArticle()
        }
    }, [user])
    useEffect(() => {
        // Load questions when data is loaded.
        if (data.article) {
            loadQuestions()
        }
    }, [data.article])
    useEffect(() => {
        // Determine if article is in favorite list
        setData(s => ({
            ...s,
            isFavorite: data.favoriteArticles.includes(data.article?.title),
        }))
    }, [data.favoriteArticles])

    console.log({ data })

    return (
        <Routes>
            <Route
                path=""
                element={
                    <Main data={data} setData={setData} getFavoriteArticles={getFavoriteArticles} userData={userData} />
                }
            />
            <Route path="questions" element={<Questions data={data} />} />
        </Routes>
    )
}

export default Article
