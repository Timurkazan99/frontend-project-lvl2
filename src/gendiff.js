import _ from 'lodash';
import ParseFile from './parsers.js';

const objInclude = (key, obj) => obj[key] !== undefined;
const includeBoth = (key, obj1, obj2) => objInclude(key, obj1) && objInclude(key, obj2);
const firstInclude = (key, obj1, obj2) => objInclude(key, obj1) && !objInclude(key, obj2);

const isObject = (val) => {
  if (val === null) {
    return false;
  }
  return typeof val === 'object';
};

const sortByKeys = (str1, str2) => {
  const newStr1 = str1.replace(/^.? /, '').replace(/:.*/, '');
  const newStr2 = str2.replace(/^.? /, '').replace(/:.*/, '');
  const temp = newStr1.localeCompare(newStr2);
  if (temp === 0) {
    if (str1.startsWith('-')) {
      return 1;
    }
    if (str2.startsWith('-')) {
      return 1;
    }
  }
  return temp;
};

const updateAfterSort = (obj, key, unordered) => {
  const temp = { ...obj };
  temp[key] = unordered[key];
  return temp;
};

const getKeys = (obj1, obj2, fun) => {
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)])
    .filter((key) => fun(key, obj1, obj2));
  return keys;
};

const newKey = (acc, key, obj, prefix) => {
  const temp = { ...acc };
  temp[`${prefix} ${key}`] = obj[key];
  return temp;
};

const propertyUptated = (acc, obj1, obj2, key) => {
  acc[`- ${key}`] = obj1[key];
  acc[`+ ${key}`] = obj2[key];
};

const compareObj = (obj1, obj2) => {
  const iter = (acc, key) => { // Функция для сравнения одинаковых свойств
    const temp = { ...acc };
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      temp[key] = compareObj(obj1[key], obj2[key]);
    } else if (obj1[key] === obj2[key]) {
      temp[key] = obj1[key];
    } else {
      propertyUptated(temp, obj1, obj2, key);
    }
    return temp;
  };

  const common = getKeys(obj1, obj2, includeBoth).reduce(iter, {});
  const unique1 = getKeys(obj1, obj2, firstInclude).reduce((acc, key) => newKey(acc, key, obj1, '-'), {});
  const unique2 = getKeys(obj2, obj1, firstInclude).reduce((acc, key) => newKey(acc, key, obj2, '+'), {});
  const unordered = { ...common, ...unique1, ...unique2 };
  const result = Object.keys(unordered)
    .sort(sortByKeys)
    .reduce((obj, key) => updateAfterSort(obj, key, unordered), {});
  return result;
};

const gendiff = (file1, file2) => {
  const obj1 = ParseFile(file1);
  const obj2 = ParseFile(file2);
  const temp = compareObj(obj1, obj2);
  const result = JSON.stringify(temp, null, '\t')
    .replaceAll(/,|"/g, '')
    .replaceAll('\t', '    ')
    .replaceAll('  -', '-')
    .replaceAll('  +', '+')
    .replaceAll(/ \n/g, '\n');
  return result;
};

export default gendiff;
