'use strict';

describe('$Http', () => {
    var _$Http;

    beforeEach(angular.mock.module('shenmaApp'));

    beforeEach(angular.mock.inject((_$injector_) => {
        _$Http = _$injector_.get('$Http');
    }));

    it('should be rewrite the $Http.req every time', () => {
        const url = '/a/b';
        const data = { a: 1 };
        const config = { 'X-Header': 'nothing' };
        const empty = null;

        _$Http({ url, data, method: 'GET' });
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('GET');
        _$Http.post(url, data, config);
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('POST');
        expect(_$Http.req['X-Header']).toEqual('nothing');
        _$Http.get(url, data, config);
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('GET');
        expect(_$Http.req['X-Header']).toEqual('nothing');
        _$Http.head(url, data, config);
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('HEAD');
        expect(_$Http.req['X-Header']).toEqual('nothing');
        _$Http.put(url, data, config);
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('PUT');
        expect(_$Http.req['X-Header']).toEqual('nothing');
        _$Http.delete(url, data, config);
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('DELETE');
        expect(_$Http.req['X-Header']).toEqual('nothing');
        _$Http.jsonp(url, data, config);
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('JSONP');
        expect(_$Http.req['X-Header']).toEqual('nothing');
        _$Http.patch(url, data, config);
        expect(_$Http.req.url).toEqual(url);
        expect(_$Http.req.data.a).toEqual(data.a);
        expect(_$Http.req.method).toEqual('PATCH');
        expect(_$Http.req['X-Header']).toEqual('nothing');

        _$Http({ url, data: empty, method: 'custom' });
        expect(_$Http.req.data).toBeNull();
        expect(_$Http.req.method).toEqual('CUSTOM');
        _$Http({ url, data: empty, config });
        expect(_$Http.req.method).toEqual('GET');
    });

    it('shoule be return Http itself', () => {
        const httpSelf = _$Http('/test');
        expect(typeof httpSelf).toEqual('function');
        expect(httpSelf.name).toEqual('Http');
    });
});
