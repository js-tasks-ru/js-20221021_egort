/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    let tempString = '';
    let newString = '';

    if (size === 0) {
        return '';
    }
    if (size === undefined) {
        return string;
    }

    for (const symb of string) {
        if (tempString.length === 0) { // если строка пустая то записываем в нее символ
            tempString += symb;
            continue;
        }
        if (!tempString.includes(symb)) { // если следующего символа нет во временной строке, значит это новый символ
            newString += tempString;
            tempString = symb;
            continue;
        }
        if (tempString.length < size) { // если длина строки еще допустима, то прибавляем
            tempString += symb;
        }
    }
    newString += tempString; // записываем остаток в новую строку
    return newString;
}