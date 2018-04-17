/**
 * Created by Administrator on 2018/4/13.
 */
import { compose, curry } from 'compose-parallel';
const angular = require('angular');

angular.module('shenmaApp')
    .controller('homeController', ($scope) => {
        $scope.home = "this is home";
        $scope.log = [];
        $scope.valuess = { name: 'misko', gender: 'male' };
        $scope.example = {
            value: new Date(2010, 11, 28, 14, 57)
        };
        angular.forEach($scope.valuess, function (value, key) {
            this.push(key + ":log " + value);
        }, $scope.log);

        const add = (x, y) => x + y;
        const numbers = [1, 2, 4, 6, 8, 4, 5];
        const arr1 = [0, 1, 2];
        const arr2 = [3, 4, 5];
        // $scope.es6=add(...numbers);
        // $scope.es6=Math.max(...numbers);
        arr1.push(...arr2);
        // $scope.es6=arr1;

        const a2 = [...arr1];


        const arar = [
            ...(2 > 0 ? ['a'] : [])
        ];
        const [a, ...b] = numbers;
        // console.log('hello'.split("").join("-"));

        let arrayLike = {
            '0': 'a',
            '1': 'b',
            '2': 'c',
            length: 3
        };

        let arr = [...arrayLike];

        let map = new Map([
            [1, 'one'],
            [2, 'two'],
            [3, 'three']
        ]);

        // $scope.es6=[...map.keys()];
        // $scope.es6=Array.from(arrayLike);

        let ps = document.querySelectorAll('li');

        Array.from(ps).filter(p => {
            return p.className.indexOf('i')
        });
        // $scope.es6=Array.from([0, ,3,4,,7], (n) => n || 'hi');
        // $scope.es6=Array.from({length:2});
        // $scope.es6=Array.of(2,4,7,"fi");
        for (let elem of ['a', 'b'].values()) {
            console.log(elem);
        };
        // $scope.es6=[1,2,3,"hi"].includes("hi");
        $scope.es6 = [1, 2, 3, 4, 5, 6].reduce((x, y) => {
            return x + y
        }, 5);
        $scope.greeting = true;
        const prom = new Promise(function (resolve, reject) {
            if ($scope.greeting) {
                resolve($scope.greeting);
            }
        });

        $scope.Greeting = () => {
            prom.then(function (res) {
                console.log('greeting: ' + res)
            })
        };

        const addFun = x => (y => x + y);
        const allf = addFun(5);
        $scope.all = allf(4);



        //x=6
        var fun11 = function (x) {
            //y=2
            return function (y) {
                return x + y;
            }
        };
        var fun22 = function (y) {
            return 2 * y;
        };
        var calculate = compose(fun22, fun11(6))
        $scope.num2 = calculate(2, 5)

        // const luke = 'LUKE';
        // const obj = {
        //     luke
        // }

        // console.log(Object.prototype.hasOwnProperty.call(obj, key));

        // const original = { a: 1, b: 2 };
        // const copy = { ...original, c: 3 };
        // const { A, notA } = copy;
        // const items = [1, 2, 3];

        // const itemscopy = [...items];

        // const foo = document.querySelectorAll('div');
        // const nodes = Array.from(nodes);
        // const nodes1 = [...foo];

        // inbox.filter((msg) => {
        //     if (subject === 'mock') {
        //         return auther === 'joo'
        //     }

        //     return false;
        // });

        // const arr = [[0, 1], [1, 2]];
        // const objectInarray = [
        //     {
        //         id: 1
        //     },
        //     {
        //         id: 2
        //     }
        // ];

        // function getFullName(user) {
        //     const { firstname, lastname } = user;
        //     return `${firstname}${lastname}`
        // }

        // function getFulln({ firstname, lastname }) {
        //     return `${firstname}${lastname}`
        // };

        // const arr = [1, 2, 3];
        // const [first, second] = arr;

        // function processInput(input) {
        //     return { left, right, top, bottom }
        // };

        // const { left, top } = processInput(input);

        // const name = 'capt.janeway';

        // function sayHi(name) {
        //     retrun`How are you, ${name}?`;
        // };

        // let test;
        // if (currentUser) {
        //     test = () => {
        //         console.log('Yup!')
        //     }
        // };

        // function concatenateAll(...args) {
        //     return args.join('-');
        // };

        // function handleThings(name, opt = {}) {

        // };

        // function f2(obj) {
        //     const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
        // };

        // [1, 2, 3].map((x) => {
        //     const y = x * 2;
        //     return x + y;
        // });

        // [1, 2, 3].map(number => `A string containing the ${number}`);

        // [1, 2, 3].map((number) => {
        //     const nextNumber = number + 1;
        //     retrun`A string containing the ${number}`;
        // })

        $scope.maps = [1, 2, 3].map((number, index) => ({
            [index]: number,
        }))

        class Queue {
            constructor(contents = []) {
                this.queue = [...contents];
                this.number = 23;
            }

            pop() {
                const value = this.queue[0];
                this.queue.splice(0, 1);
                return value
            }

        };

        class PeekableQueue extends Queue {
            peek() {
                console.log(this.number);
            }
        };





    })