import _ from 'lodash';
import ParseFile from './parsers.js';

const objIncude = (key, obj) => obj[key] !== undefined;
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

const getKeys = (obj) => {
  if (_.isEqual(obj, {})) {
    return [];
  }
  return Object.keys(obj);
};

const compareObj = (obj1, obj2) => {
  const keys = _.uniq([...getKeys(obj1), ...getKeys(obj2)]);

  const iter = (acc, key) => { // Функция для сравнения одинаковых свойств
    const temp = { ...acc };
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      temp[key] = compareObj(obj1[key], obj2[key]);
    } else if (obj1[key] === obj2[key]) {
      temp[key] = obj1[key];
    } else {
      const newKey1 = `- ${key}`;
      const newKey2 = `+ ${key}`;
      temp[newKey1] = obj1[key];
      temp[newKey2] = obj2[key];
    }
    return temp;
  };

  const common = keys
    .filter((key) => objIncude(key, obj1) && objIncude(key, obj2))
    .reduce(iter, {});
  const unique1 = {};
  keys.filter((key) => objIncude(key, obj1) && !objIncude(key, obj2))
    .map((key) => {
      unique1[`- ${key}`] = obj1[key];
      return obj1[key];
    });
  const unique2 = {};
  keys.filter((key) => !objIncude(key, obj1) && objIncude(key, obj2))
    .map((key) => {
      unique2[`+ ${key}`] = obj2[key];
      return obj2[key];
    });
  const unordered = { ...common, ...unique1, ...unique2 };
  const result = Object.keys(unordered)
    .sort(sortByKeys)
    .reduce((obj, key) => {
      const temp = { ...obj };
      temp[key] = unordered[key];
      return temp;
    }, {});
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
