/**
 * Function returns the given array with no duplicates.
 * @param arr Array to remove duplicates from.
 * @param cb Callback function to compare between items.
 * @returns Array with no duplicates.
 */
export function removeDuplicates(arr, cb) {
    if (!arr.length) {
        return []
    }
    const newArr = []
    for (const item of arr) {
        if (!newArr.find(i => cb(i, item))) {
            newArr.push(item)
        }
    }
    return newArr
}
