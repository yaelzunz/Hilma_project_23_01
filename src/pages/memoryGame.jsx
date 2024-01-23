import React, { useEffect, useState } from 'react'
import { easy, easy_hebrew, hard, hard_hebrew } from '../difficulty/WordDifficulty'
// Components
import BtnGoBack from '../components/BtnGoBack'
import SingleCard from '../components/memoryGame/singleCard'
// Styles
import styles from '../styles/pages/memoryGame.module.css'

function generate() {
    // Function generates 12 random cards - 6 english and 6 hebrew

    // Constants
    const size = easy_hebrew.length
    const index = [],
        cardEasyEnglish = [],
        cardEasyHebrow = []

    while (index.length != 6) {
        let randomIndex = Math.floor(Math.random() * size)

        if (!index.includes(randomIndex)) {
            index.push(randomIndex)
            cardEasyEnglish.push({ src: easy[randomIndex], matched: false, inx: randomIndex })
            cardEasyHebrow.push({ src: easy_hebrew[randomIndex], matched: false, inx: randomIndex })
        }
    }

    return [...cardEasyEnglish, ...cardEasyHebrow]
}

export default function MemoryGame() {
    // Constants
    const words = generate()

    // States
    const [hasStartedSession, setHasStartedSession] = useState(false)
    const [cards, setCards] = useState([])
    const [turns, setTurns] = useState(-1)
    const [choiceOne, setChoiceOne] = useState(null)
    const [choiceTwo, setChoiceTwo] = useState(null)
    const [initIsActive, setInitIsActive] = useState(false)

    // Handlers
    function shuffleCards() {
        // Function shuffles the cards and resets the turns.

        // Shuffle the cards & set turns.
        setCards(words.sort(() => Math.random() - 0.5).map(card => ({ ...card, id: Math.random() })))
        setTurns(0)
        setHasStartedSession(true)
    }

    function handleChoice(card) {
        // Function handles the user choice.

        if (choiceOne) {
            setChoiceTwo(card)
        } else {
            setChoiceOne(card)
        }
    }

    function finish() {
        let counter = 0
        cards.forEach(e => {
            if (e.matched === true) {
                console.log(e.matched)
                counter += 1
            }
            if (counter === cards.length) {
                alert('finish')
            }
        })
    }

    function resetTurn() {
        // Function resets the turn.

        setChoiceOne(null)
        setChoiceTwo(null)
        setTurns(prevTurns => prevTurns + 1)
    }

    // Effects
    useEffect(() => {
        // Effect checks if the user has made a choice.

        if (choiceOne && choiceTwo) {
            if (choiceOne.inx === choiceTwo.inx) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if (card.inx === choiceOne.inx) {
                            return { ...card, matched: true }
                        } else {
                            return card
                        }
                    })
                })
                resetTurn()
            } else {
                setTimeout(() => resetTurn(), 1000)
            }
        }
        finish()
    }, [choiceOne, choiceTwo])

    useEffect(() => {
        // Effects shows all cards for n secs, then hides all.
        setInitIsActive(true)
        const timeout = setTimeout(() => {
            setInitIsActive(false)
        }, 1500)
        // Clear timeout on unmount.
        return () => clearTimeout(timeout)
    }, [hasStartedSession])

    return (
        <div className={styles['MemoryGame']}>
            {/* btn : back */}
            <BtnGoBack title="Back to article" />
            <section className={styles['heading']}>
                <h1>Magic Match</h1>
                <button className={styles['new-game']} onClick={shuffleCards}>
                    New Game
                </button>
            </section>

            <div className={styles['card-grid']}>
                {cards.map(card => (
                    <SingleCard
                        key={card.id}
                        card={card}
                        handleChoice={handleChoice}
                        flipped={card === choiceOne || card === choiceTwo || card.matched || initIsActive}
                    />
                ))}
            </div>
        </div>
    )
}
