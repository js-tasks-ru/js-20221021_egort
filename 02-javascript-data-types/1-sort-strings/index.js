/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    // new array which will be sorted
    const newArr = [...arr]; // replaced by spread operator
    // sorting with correct compare strings and rule for upper case
    newArr.sort((a, b) => {
        if (param === 'asc') {
            return localeCompareRuEnUpperFirst(a, b);
        } else if (param === 'desc') {
            return localeCompareRuEnUpperFirst(b, a);
        } else {
            throw "there is not this sort order.";
        }
    });

    return newArr;
}

/**
 * localeCompareRuEnUpperFirst - localeCompare with locales = ['ru', 'en'] and with options = caseFirst: "upper"
 * @param {string} a - first string for compare
 * @param {string} b - second string for compare
 * @returns {number}
 */
function localeCompareRuEnUpperFirst(a, b) {
    return a.localeCompare(b, ['ru', 'en'], { caseFirst: "upper" });
}
