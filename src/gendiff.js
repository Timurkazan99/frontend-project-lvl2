import _ from 'lodash';
import ParseFile from './parsers.js';
import { isObject, getKey } from './index.js';
import formate from './formatters/index.js';

const objInclude = (key, obj) => obj[key] !== undefined;
const includeBoth = (key, obj1, obj2) => objInclude(key, obj1) && objInclude(key, obj2);
const firstInclude = (key, obj1, obj2) => objInclude(key, obj1) && !objInclude(key, obj2);

const getKeys = (obj1, obj2, fun) => {
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)])
    .filter((key) => fun(key, obj1, obj2));
  return keys;
};

const setAction = (key, value, type, newValue = undefined) => {
  const withoutNewValue = { key, type, value };
  const withNewValue = {
    key,
    type,
    oldValue: value,
    newValue,
  };
  if (newValue === undefined) {
    return withoutNewValue;
  }
  return withNewValue;
};

const compareObj = (obj1, obj2) => {
  const iter = (key) => { // Функция для сравнения одинаковых свойств
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      const nested = {
        key,
        type: 'nested',
        children: compareObj(obj1[key], obj2[key]),
      };
      return nested;
    } if (obj1[key] === obj2[key]) {
      return setAction(key, obj1[key], 'unchanged');
    }
    return setAction(key, obj1[key], 'changed', obj2[key]);
  };

  const common = getKeys(obj1, obj2, includeBoth).map(iter);
  const unique1 = getKeys(obj1, obj2, firstInclude)
    .map((key) => setAction(key, obj1[key], 'removed'));
  const unique2 = getKeys(obj2, obj1, firstInclude)
    .map((key) => setAction(key, obj2[key], 'added'));
  const result = [...common, ...unique1, ...unique2].flat();
  return _.sortBy(result, getKey);
};

const gendiff = (file1, file2, style) => {
  const obj1 = ParseFile(file1);
  const obj2 = ParseFile(file2);
  const temp = compareObj(obj1, obj2).flat();
  const result = formate(temp, style);
  return result;
};

export default gendiff;
