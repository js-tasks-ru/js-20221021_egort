/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    // new array which will be sorted
    const newArr = arr.slice(); // replaced method map() by slice() for copy array // replaced let by const because array is an object
    // sorting with correct compare strings and rule for upper case
    newArr.sort((a, b) => {
        return param === 'asc' ?
            localeCompareRuEnUpperFirst(a, b) :
            localeCompareRuEnUpperFirst(b, a); // replaced localeCompare() with parameters by new function 
    });

    return newArr;

}

/**
 * localeCompareRuEnUpperFirst - localeCompare with locales = ['ru', 'en'] and with options = caseFirst: "upper"
 * @param {string} a - frist string for compare
 * @param {string} b - second string for compare
 * @returns {number}
 */
function localeCompareRuEnUpperFirst(a, b) {
    return a.localeCompare(b, ['ru', 'en'], { caseFirst: "upper" });
}
