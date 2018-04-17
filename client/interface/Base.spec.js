'use strict';

import Base from './Base';

describe('Class Base', () => {
    it('should be correct any way via variable has base structure', () => {
        let error = 'empty', result;
        try {
            result = new Base(null);
            result = new Base(undefined);
            result = new Base(-1);
            result = new Base(0);
            result = new Base(1);
            result = new Base([]);
            result = new Base({});
            result = new Base('');
            result = new Base('abc');
            result = new Base('123');
            result = new Base('123abc');
            result = new Base('[]');
            result = new Base('{}');
        } catch (e) {
            error = e;
        }
        expect(error).toEqual('empty');
    });

    it('should be correct attribute used', () => {
        const base = new Base();
        const a = 1;
        base.setAttr('a', a);
        expect(base.getAttr('a')).toEqual(a);
    });
});
