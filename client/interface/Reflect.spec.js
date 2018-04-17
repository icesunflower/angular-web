'use strict';

import Reflect from './Reflect';

describe('Class Reflect', () => {
    it('should be initlized correctly anyway', () => {
        let error = 0;
        try {
            new Reflect(-1);
            new Reflect(0);
            new Reflect(1);
            new Reflect(NaN);
            new Reflect('0');
            new Reflect(null);
            new Reflect(undefined);
            new Reflect([]);
            new Reflect({});
        } catch (e) {
            error = e;
        }
        expect(error).toEqual(0);
    });

    it('should be has some attribute between _result and class', () => {
        const a = new Reflect(['a', 'b', 'c']);
        a.reflect({ a: 1, b: 2, c: 3 });
        expect(a.a).toEqual(a.getResult().a);
    });
});
