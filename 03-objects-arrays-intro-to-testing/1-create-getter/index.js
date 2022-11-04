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
        for (const arrayPathElem of arrayPath) {
            if (Object.hasOwn(currentObj, arrayPathElem)) {
                currentObj = currentObj[arrayPathElem];
            } else {
                return;
            }
        }
        return currentObj;
    }
}
