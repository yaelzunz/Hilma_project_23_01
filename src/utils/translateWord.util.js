import * as WordDifficulty from '../difficulty/WordDifficulty'

/**
 * Function translates a given word by a given difficulty.
 * @param word the word to translate `:string`
 * @param difficulty the word difficulty `:string`
 */
export function translateWord(word, difficulty) {
    switch (difficulty) {
        case WordDifficulty.HARD: {
            const index = WordDifficulty.hard.indexOf(word)
            if (index !== -1) {
                return WordDifficulty.hard_hebrew[index]
            } else {
                return ''
            }
        }
        case WordDifficulty.EASY:
        default: {
            const index = WordDifficulty.easy.indexOf(word)
            if (index !== -1) {
                return WordDifficulty.easy_hebrew[index]
            } else {
                return ''
            }
        }
    }
}
