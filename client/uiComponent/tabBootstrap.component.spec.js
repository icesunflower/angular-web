'use strict';

describe('tabBootstrap', () => {
    var $compile, $scope;
    var compileToElement;

    beforeEach(angular.mock.module('shenmaApp'));

    beforeEach(angular.mock.inject((_$rootScope_, _$compile_) => {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        compileToElement = (string, scope) => $compile(angular.element(string))(scope);
    }));

    it('should be bootstrap successfully', () => {
        let element = compileToElement('<tab-bootstrap></tab-bootstrap>', $scope);
        $scope.$digest();
        expect(element[0].querySelectorAll('ul').length).toBeGreaterThan(0);
    });

    it('should be render the tabs successfully', () => {
        $scope._tabset = [{ title: 'all', index: 10 }, { title: 'only', index: 1 }];
        $scope._tabActived = 1;
        let element = compileToElement(`<tab-bootstrap tabset="_tabset" tab-actived="_tabActived"></tab-bootstrap>`, $scope);
        $scope.$digest();
        expect(element[0].querySelectorAll('li').length).toEqual($scope._tabset.length);
        expect(element[0].querySelectorAll('li')[1].className).toContain('active');
    });
});
