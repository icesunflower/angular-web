'use strict';

export default class Base {
    getAttr(key) {
        return this[key];
    }

    setAttr(key, value) {
        this[key] = value;
    }
}
