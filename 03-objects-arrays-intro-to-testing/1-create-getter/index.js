/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    // check that path is correct string
    if (path === '' || typeof (path) !== 'string') {
        return;
    }

    const arrayPath = path.split('.');

    return function getter(obj) {
        let currentObj = obj;
        for (let i = 0; i < arrayPath.length; i++) {
            if (Object.hasOwn(currentObj, arrayPath[i])) {
                currentObj = currentObj[arrayPath[i]];
            } else {
                return;
            }
        }
        return currentObj;
    }
}
