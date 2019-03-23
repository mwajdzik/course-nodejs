// spread operator
const array = [1, 2, 3];
const newArray = [...array, 4, 5, 6];

const obj = {a: 1, b: 2};
const newObj = {...obj, c: 3, d: 4};

console.log(newArray, newObj);


// rest operator
function f(...args) {
    return args.length;
}

console.log(f(1, 2, 3), f(1, 2, 3, 4, 5));


// destructuring object and arrays - { prop }
function g({a}) {
    console.log(a);
    return {a};
}

const {a} = g(obj);
console.log(a);


// template literals
const name = "Max";
const age = 29;
console.log(`My name is ${name} and I am ${age} years old.`);


// async
const fetchData1 = (callback) => {
    setTimeout(() => {
        callback('Done fetching the data');
    }, 1500);
};

setTimeout(() => {
    console.log('Done');

    fetchData1((text) => {
        console.log('Msg: ' + text);
    });
}, 2000);


// with a promise
const fetchData2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done fetching the data');
        }, 1500);
    });
};

setTimeout(() => {
    console.log('Done');

    fetchData2()
        .then((text) => {
            console.log('Msg: ' + text);
        });
}, 2000);

console.log('Waiting for done...');
