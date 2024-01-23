import { useEffect, useState } from 'react'
// Firebase
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
// Utils
import { removeDuplicates } from '../utils/objects.util'
// Components
import ArticleItem from '../components/article/ArticleItem'
// Icons
import { AiOutlineSearch } from 'react-icons/ai'
// Configs
import { NEWS_DATA_API_KEY } from '../configs/apikeys.config'
import { NEWS_API_URL } from '../configs/url.config'
import * as WordDifficulty from '../difficulty/WordDifficulty'
// Styles
import styles from '../styles/pages/search.module.css'

export default function ChoosePage() {
    // States
    const queryParams = new URLSearchParams(window.location.search)
    const q = queryParams.get('q')

    const [query, setQuery] = useState(q ?? '')
    const [difficulty, setDifficulty] = useState(WordDifficulty.EASY)
    const [data, setData] = useState([])
    const [user, loading, error] = useAuthState(auth)

    const [interestingArticles, setInterestingArticles] = useState([])
    const [myArticles, setMyArticles] = useState([])

    const getArticales = async () => {
        if (loading) {
            console.log('Loading user data')
            return
        } else if (error) {
            // An error occurred while fetching user data
            window.location.href = '/login'
        } else {
            // User is authenticated
            console.log('User is authenticated:', user.email)

            // Get user details
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            if (!userDoc.exists()) {
                // User document does not exist
                console.log('User document does not exist')
                return
            }

            // Get random interest from array.
            const interests = userDoc.data().interests
            const random_interest = Math.round(Math.random() * interests.length)
            // Get suggested articles
            const interests_as_str = interests[random_interest]
            const res = await fetch(NEWS_API_URL.search(interests_as_str))
            const data = await res.json()

            // Remove duplicate articles & set interesting-articles
            const uniqueArticles = removeDuplicates(data.results ?? [], (a, b) => a.article_id === b.article_id)
            setInterestingArticles(uniqueArticles)

            // Get user articles
            const userArticles = userDoc.data().favoriteArticles ?? []
            console.log({ userArticles })
            const _myArticles = []
            for (const title of userArticles) {
                // Get article data by title (as id)
                const res = await fetch(NEWS_API_URL.by_title(title))
                const data = await res.json()
                console.log('ufavorite articles from news api')
                console.log({ data })
                if (uniqueArticles?.[0]) _myArticles.push(uniqueArticles?.[0])
            }
            setMyArticles(_myArticles)
        }
    }

    // Handlers
    const getData = async () => {
        // Get user details
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) {
            // User document does not exist
            console.log('User document does not exist')
            return
        }
        // Set user difficulty
        setDifficulty(userDoc.data().diffuculty ?? WordDifficulty.EASY)
    }

    const searchArticlesHandler = async () => {
        // Load articles on screen.

        const minWordCount = 500,
            maxWordCount = 1000

        const res = await fetch(NEWS_API_URL.search(query))
        const data = await res.json()

        let chosenArticle = null
        let difficultyMaxWordCount = -1

        // Filter articles by word count
        let results = data.results?.filter(article => {
            const wordCount = article.content?.split(' ').length ?? 0
            return wordCount > minWordCount && wordCount < maxWordCount
        })

        console.log(data.results)
        console.log(results)

        // Set articles
        setData(results)
        return

        // results.map(article => {

        //     let difficultyWordCount = 0;

        //     // Extract words from article
        //     const words = article.content.split(' ')

        //     // Count word difficulties
        //     switch (difficulty) {
        //         case WordDifficulty.EASY: {
        //             // Count easy words
        //             difficultyWordCount = words.reduce((acc, word) => acc + WordDifficulty.easy.includes(word) ? 1 : 0, 0)
        //             break
        //         }
        //         case WordDifficulty.HARD: {
        //             // Count hard words
        //             difficultyWordCount = words.reduce((acc, word) => acc + WordDifficulty.hard.includes(word) ? 1 : 0, 0)
        //             break
        //         }
        //     }

        //     // Highlight words in article content by difficulty level and replace them with their translation.
        //     for (let i = 0; i < words.length; i++) {
        //         if (difficulty === WordDifficulty.EASY) {
        //             const index = WordDifficulty.easy.indexOf(words[i]);
        //             if (index !== -1) {
        //                 const word = words[i];
        //                 const translatedWord = WordDifficulty.easy_hebrew[index];
        //                 words[i] = <span><span onClick={e => e.currentTarget.innerText = WordDifficulty.easy.indexOf(e.currentTarget.innerText) !== -1 ? translatedWord : word} style={{backgroundColor: "yellow", cursor: 'help'}}>{word}</span> </span>
        //             }
        //             else
        //                 words[i] += ' '
        //         }
        //         else {
        //             const index = WordDifficulty.hard.indexOf(words[i]);
        //             if (index !== -1) {
        //                 const word = words[i];
        //                 const translatedWord = WordDifficulty.hard_hebrew[index];
        //                 words[i] = <span><span onClick={e => e.currentTarget.innerText = WordDifficulty.hard.indexOf(e.currentTarget.innerText) !== -1 ? translatedWord : word} style={{backgroundColor: "yellow", cursor: 'help'}}>{word}</span> </span>
        //             }
        //             else
        //                 words[i] += ' '
        //         }
        //     }

        //     article.words = words;

        //     if (difficultyWordCount > difficultyMaxWordCount) {
        //         difficultyMaxWordCount = difficultyWordCount;
        //         chosenArticle = article;
        //     }
        // });
    }

    // Effects
    useEffect(() => {
        if (user) {
            getData()
            getArticales()
        }
    }, [user])

    useEffect(() => {
        // Make initial load request if params exist.
        if (q) {
            searchArticlesHandler()
        }
    }, [])

    return (
        <div className={styles['container']}>
            <section className={styles['form']}>
                <div className={styles['input-search']}>
                    <input
                        placeholder="Search topics"
                        defaultValue={query}
                        onChange={event => setQuery(event.target.value)}
                        type="text"
                    />
                    <button className={styles['submit']} onClick={searchArticlesHandler}>
                        <AiOutlineSearch size={18} />
                    </button>
                </div>
            </section>
            <section className={styles['articles-list-group']}>
                <h3>Show results for "{query}"</h3>
                <div className={styles['articles-list']}>
                    {data.map((article, i) => (
                        <ArticleItem key={i} {...article} />
                    ))}
                </div>
            </section>

            <section className={styles['interesting-articles']}>
                <div className={styles['heading']}>
                    <div className={styles['title']}>
                        <h3>מאמרים שיכולים לעניין אותך</h3>
                    </div>
                </div>
                <div className={styles['articles-list']}>
                    {interestingArticles.map?.((a, i) => (
                        <ArticleItem key={i} {...a} />
                    ))}
                </div>
            </section>
        </div>
    )
}
