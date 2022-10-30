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
    // array with step properties is reversed for optimized
    const arrayPath = path.split('.').reverse();
    const numStepProperty = arrayPath.length;

    return function getter(obj) {
        let nameCurrentProperty = arrayPath.pop();
        let currentObj = obj;
        for (let i = 0; i < numStepProperty; i++) {
            if (Object.hasOwn(currentObj, nameCurrentProperty)) {
                currentObj = currentObj[nameCurrentProperty];
            } else {
                return;
            }
            nameCurrentProperty = arrayPath.pop();
        }
        return currentObj;
    }
}
