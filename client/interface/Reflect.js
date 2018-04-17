'use strict';

import Base from './Base';

/*
 * @Class Reflect
 *
 * The class Reflect make a way to support the reflection of data in the front end
 * so that the data used can be know to everyone who tries to watch code.
 *
 * we use it, respect it and know it.
 * It become our friend, not be our tool only.
 */
export default class Reflect extends Base {
    /*
     * @param keys {Array}
     * @param result {Object}
     */
    constructor(keys) {
        super();
        this.keys = keys;
        this._result = {};
    }

    /*
     * reflect
     *
     * @param keys {Array}
     * @param result {Object}
     */
    reflect(result) {
        let i = 0, l = this.keys.length;
        while (i < l) {
            this[this.keys[i]] = result[this.keys[i]];
            this._result[this.keys[i]] = result[this.keys[i]];
            i++;
        }
    }

    getResult() {
        return this._result;
    }

    getAttr(key) {
        const _attr = super.getAttr(key);
        return _attr ? _attr : {};
    }
}
