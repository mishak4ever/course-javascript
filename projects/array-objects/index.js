/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:
 
 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 
 Пример:
 forEach([1, 2, 3], (el) => console.log(el))
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:
 
 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 
 Пример:
 map([1, 2, 3], (el) => el ** 2) // [1, 4, 9]
 */
function map(array, fn) {
    let arr = [];
    for (let i = 0; i < array.length; i++) {
        arr.push(fn(array[i], i, array));
    }

    return  arr;
}

/*
 Задание 3:
 
 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 
 Пример:
 reduce([1, 2, 3], (all, current) => all + current) // 6
 */
function reduce(array, fn, initial) {
    let i = 0;
    if (initial === undefined) {
        var initial = array[0];
        i++;
    }
    for (i; i < array.length; i++) {
        initial = fn(initial, array[i], i, array);
    }

    return  initial;
}

/*
 Задание 4:
 
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива
 
 Пример:
 upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    var names = [];
    for (var prop in obj) {
        names.push(prop.toUpperCase());
    }
    return names;
}

/*
 Задание 5 *:
 
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 
 Пример:
 const obj = createProxy({});
 obj.foo = 2;
 console.log(obj.foo); // 4
 */
function createProxy(obj) {
    obj = new Proxy(obj, {
        set(target, prop, val) {
            target[prop] = (typeof val == 'number') ? val * val : val;
            return true;
        }
    });
    return obj;
}

export { forEach, map, reduce, upperProps, createProxy };